import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Download, RefreshCw, Search, ReceiptText, CircleDollarSign, Clock3, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useRemoteData } from "@/hooks/useRemoteData";
import { loadSales, filterSales, salesSummary, salesCSV, saleMoney } from "@/api/salesHistory.api";

import PaymentReconciliation from "@/components/pos/PaymentReconciliation";
import SalePaymentActions from "@/components/pos/SalePaymentActions";

const PAGE_SIZE = 10;
const statuses = ["COMPLETED", "PENDING", "CANCELLED", "REFUNDED"];
const label = (text) => text ? text.charAt(0) + text.slice(1).toLowerCase() : "Unknown";
const shortId = (id) => String(id).slice(0, 8).toUpperCase();
const dateTime = (value) => new Intl.DateTimeFormat("en-GH", {
  timeZone: "Africa/Accra", dateStyle: "medium", timeStyle: "short",
}).format(new Date(value));

function Status({ value }) {
  const colors = {
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-800",
    PENDING: "border-amber-200 bg-amber-50 text-amber-800",
    CANCELLED: "border-[#ddd] bg-[#f4f4f4] text-[#666]",
    REFUNDED: "border-red-200 bg-red-50 text-red-700",
  };
  return <span className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[11px] font-medium ${colors[value] || colors.CANCELLED}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />{label(value)}
  </span>;
}

export default function Sales() {
  const { data, loading, error, reload } = useRemoteData(loadSales);
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => filterSales(data || [], { search, status, from, to }), [data, search, status, from, to]);
  const stats = useMemo(() => salesSummary(filtered), [filtered]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const invalidDates = from && to && from > to;
  const hasFilters = Boolean(search || status !== "all" || from || to);
  const cards = [
    { title: "COMPLETED SALES", value: saleMoney(stats.revenue), note: `${stats.completed} completed transactions`, icon: CircleDollarSign },
    { title: "TRANSACTIONS", value: stats.count.toLocaleString(), note: "Across the selected filters", icon: ReceiptText },
    { title: "AVERAGE SALE", value: saleMoney(stats.average), note: "Completed transactions only", icon: ShoppingBag },
    { title: "PENDING", value: stats.pending.toLocaleString(), note: "Awaiting completion", icon: Clock3 },
  ];

  function change(setter, value) { setter(value); setPage(1); }
  function clearFilters() { setSearch(""); setStatus("all"); setFrom(""); setTo(""); setPage(1); }
  function exportCSV() {
    const url = URL.createObjectURL(new Blob(["\uFEFF", salesCSV(filtered)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "nexapos-sales.csv";
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-full bg-[#fafafa] px-4 py-5 text-black">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[34px] font-bold tracking-tight">Sales</h1>
            <p className="mt-1 text-[14px] text-[#666]">Track transactions, review orders, and keep your sales records in view.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="h-10 gap-2 rounded-none" onClick={reload} disabled={loading}><RefreshCw size={15} className={loading ? "animate-spin" : ""} />Refresh</Button>
            <Button variant="outline" className="h-10 gap-2 rounded-none" onClick={exportCSV} disabled={loading || Boolean(error) || !filtered.length}><Download size={15} />Export CSV</Button>
            {hasPermission("sales.create") && <Button asChild className="h-10 gap-2 rounded-none bg-black text-white hover:bg-[#222]"><Link to="/pos">Open POS<ArrowUpRight size={16} /></Link></Button>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ title, value, note, icon: Icon }) => <div key={title} className="border border-[#d8cece] bg-white p-5">
            <div className="flex items-center justify-between gap-3"><span className="text-[11px] font-semibold tracking-wider text-[#666]">{title}</span><Icon size={18} className="text-[#888]" /></div>
            <p className="mt-3 text-[27px] font-bold tracking-tight tabular-nums">{loading || error ? "—" : value}</p>
            <p className="mt-1 text-[12px] text-[#777]">{note}</p>
          </div>)}
        </div>

        <section className="border border-[#d8cece] bg-white" aria-label="Sales history">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ddd] px-5 py-4">
            <div><h2 className="text-[16px] font-semibold">Transaction history</h2><p className="mt-1 text-xs text-[#777]">All amounts in GHS · Dates in Accra time</p></div>
            {!loading && !error && <span className="border border-[#ddd] bg-[#f6f6f6] px-2 py-1 text-xs text-[#555]">{filtered.length} records</span>}
          </div>
          <div className="grid grid-cols-1 gap-3 border-b border-[#ddd] bg-[#fafafa] p-4 sm:grid-cols-2 xl:grid-cols-[minmax(220px,2fr)_1fr_1fr_1fr_auto]">
            <div><label htmlFor="sales-search" className="mb-1.5 block text-xs font-medium text-[#555]">Search transactions</label><div className="relative"><Search size={15} className="absolute left-3 top-3 text-[#888]" /><Input id="sales-search" value={search} onChange={(e) => change(setSearch, e.target.value)} placeholder="Order, customer, cashier, or product" className="h-10 rounded-none bg-white pl-9" /></div></div>
            <div><label htmlFor="sales-status" className="mb-1.5 block text-xs font-medium text-[#555]">Status</label><select id="sales-status" value={status} onChange={(e) => change(setStatus, e.target.value)} className="h-10 w-full border border-[#ddd] bg-white px-3 text-sm"><option value="all">All statuses</option>{statuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></div>
            <div><label htmlFor="sales-from" className="mb-1.5 block text-xs font-medium text-[#555]">From</label><Input id="sales-from" type="date" value={from} onChange={(e) => change(setFrom, e.target.value)} className="h-10 rounded-none bg-white" /></div>
            <div><label htmlFor="sales-to" className="mb-1.5 block text-xs font-medium text-[#555]">To</label><Input id="sales-to" type="date" value={to} onChange={(e) => change(setTo, e.target.value)} className="h-10 rounded-none bg-white" /></div>
            <Button variant="ghost" className="h-10 self-end rounded-none text-[#666]" onClick={clearFilters} disabled={!hasFilters}>Clear filters</Button>
          </div>
          {invalidDates && <p role="alert" className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">The end date must be on or after the start date.</p>}
          {loading ? <div role="status" className="flex items-center justify-center gap-2 py-24 text-sm text-[#666]"><RefreshCw size={18} className="animate-spin" />Loading sales...</div>
            : error ? <div role="alert" className="px-5 py-16 text-center"><p className="text-sm text-red-700">{error}</p><Button variant="outline" onClick={reload} className="mt-4 rounded-none">Try again</Button></div>
            : <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="border-b border-[#d6cece] bg-[#e9e9e9] text-[12px] text-[#444]"><tr>{["Order", "Date & time", "Customer", "Cashier", "Payment", "Status", "Total", ""].map((heading, i) => <th key={i} className={`px-4 py-3 font-semibold ${heading === "Total" ? "text-right" : ""}`}>{heading || <span className="sr-only">Details</span>}</th>)}</tr></thead>
                  <tbody>{visible.length ? visible.map((sale) => <tr key={sale.id} className="border-b border-[#e5e0e0] last:border-0 hover:bg-[#fafafa]">
                    <td className="px-4 py-4"><span className="font-mono text-xs font-semibold" title={sale.id}>#{shortId(sale.id)}</span><p className="mt-1 text-[11px] text-[#888]">{(sale.items || []).reduce((sum, item) => sum + Number(item.quantity), 0)} units</p></td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-[#666]">{dateTime(sale.created_at)}</td>
                    <td className="max-w-[180px] truncate px-4 py-4 font-medium" title={sale.customer_name}>{sale.customer_name || "Walk-in customer"}</td>
                    <td className="px-4 py-4 text-xs text-[#666]">{sale.cashier_name || `Cashier #${sale.cashier}`}</td>
                    <td className="px-4 py-4 text-xs text-[#666]">{sale.payment_methods?.join(", ") || "Not recorded"}</td>
                    <td className="px-4 py-4"><Status value={sale.status} /></td>
                    <td className="whitespace-nowrap px-4 py-4 text-right font-semibold tabular-nums">{saleMoney(sale.total)}</td>
                    <td className="px-4 py-4"><Button variant="ghost" size="sm" className="rounded-none text-xs" onClick={() => setSelected(sale)} aria-label={`View sale ${shortId(sale.id)}`}>View<ArrowUpRight size={13} /></Button></td>
                  </tr>) : <tr><td colSpan={8} className="py-20 text-center"><ReceiptText size={30} className="mx-auto mb-3 text-[#aaa]" /><p className="font-medium">{hasFilters ? "No matching sales" : "No sales recorded yet"}</p><p className="mt-1 text-xs text-[#777]">{hasFilters ? "Try another search or clear your filters." : "Transactions saved to Django will appear here."}</p></td></tr>}</tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ddd] bg-[#f2f2f2] px-4 py-3 text-xs text-[#666]">
                <span>Showing {filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} sales</span>
                <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="rounded-none" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={14} />Previous</Button><span className="px-2">{currentPage} / {pages}</span><Button variant="outline" size="sm" className="rounded-none" disabled={currentPage >= pages} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight size={14} /></Button></div>
              </div>
            </>}
        </section>
      </div>
      {hasPermission("payments.reconcile") && <PaymentReconciliation onSelect={setSelected} />}
      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-h-[90vh] min-w-0 overflow-y-auto rounded-none sm:max-w-[680px]">
          <DialogHeader><DialogTitle>Sale details</DialogTitle><DialogDescription className="break-all">{selected?.id}</DialogDescription></DialogHeader>
          {selected && <div className="min-w-0 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm text-[#666]">{dateTime(selected.created_at)}</span><Status value={selected.status} /></div>
            <div className="grid grid-cols-2 gap-4 border border-[#ddd] bg-[#fafafa] p-4 text-sm"><div><p className="text-xs text-[#777]">Customer</p><p className="mt-1 break-words font-medium">{selected.customer_name || "Walk-in customer"}</p></div><div><p className="text-xs text-[#777]">Cashier</p><p className="mt-1 break-words font-medium">{selected.cashier_name || `Cashier #${selected.cashier}`}</p></div></div>
            <div className="min-w-0 overflow-x-auto"><table className="w-full min-w-[440px] text-sm"><thead className="border-y border-[#ddd] bg-[#f2f2f2] text-xs text-[#666]"><tr><th className="p-3 text-left">Item</th><th className="p-3 text-right">Qty</th><th className="p-3 text-right">Unit price</th><th className="p-3 text-right">Subtotal</th></tr></thead><tbody>{(selected.items || []).map((item) => <tr key={item.id} className="border-b border-[#eee]"><td className="p-3">{item.product_name || `Product #${item.product}`}<p className="mt-1 text-xs text-[#888]">{item.product_sku}</p></td><td className="p-3 text-right">{item.quantity}</td><td className="p-3 text-right">{saleMoney(item.unit_price)}</td><td className="p-3 text-right">{saleMoney(item.subtotal)}</td></tr>)}</tbody></table></div>
            <div className="ml-auto max-w-[280px] space-y-2 text-sm">{[["Subtotal", selected.subtotal], ["Discount", selected.discount], ["Tax", selected.tax]].map(([name, value]) => <div key={name} className="flex justify-between text-[#666]"><span>{name}</span><span>{saleMoney(value)}</span></div>)}<div className="flex justify-between border-t border-[#ddd] pt-3 text-lg font-bold"><span>Total</span><span>{saleMoney(selected.total)}</span></div></div>
            <SalePaymentActions key={selected.id} sale={selected} onUpdated={(sale) => { setSelected(sale); reload(); }} />
            <p className="border-t border-[#ddd] pt-3 text-xs text-[#777]">Payment method: {selected.payment_methods?.join(", ") || "Not recorded"}</p>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
