import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/api/axios";
import { jsPDF } from "jspdf";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ReceiptHeader from "@/components/receipts/ReceiptHeader";
import ReceiptStats from "@/components/receipts/ReceiptStats";
import ReceiptFilters from "@/components/receipts/ReceiptFilters";
import ReceiptTable from "@/components/receipts/ReceiptTable";
import ReceiptPreview from "@/components/receipts/ReceiptPreview";
import ReceiptPaper from "@/components/receipts/ReceiptPaper";
import ReceiptSettingsDialog from "@/components/receipts/ReceiptSettingsDialog";

import {
  receiptMoney,
  calculateReceiptTotals,
} from "@/data/receiptsData";

import "@/styles/receipt-print.css";
import { useRemoteData } from "@/hooks/useRemoteData";
import { loadReceipts, receiptMatchesDate } from "@/api/overview.api";
const EMPTY_RECEIPTS = [];

const PAGE_SIZE = 7;

const defaultSettings = {
  storeName: "NEXUS POS",
  address: "",
  phone: "",
  taxId: "",
  footerText: "THANK YOU FOR SHOPPING WITH NEXUS POS!",
  showBarcode: true,
  showLoyalty: false,
};

function exportCSV(rows) {
  const header = [
    "Receipt Number",
    "Order",
    "Date",
    "Cashier",
        "Customer",
    "Items",
    "Payment",
    "Status",
    "Amount",
  ];

  const escapeValue = (value) => {
    const text = String(value ?? "");
    const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
  };

  const records = rows.map((receipt) => [
    receipt.receiptNo,
    receipt.orderNo,
    receipt.date,
    receipt.cashier,
    receipt.customer,
    receipt.itemsCount,
    receipt.payment,
    receipt.status,
    receipt.total,
  ]);

  const csv = [header, ...records]
    .map((row) => row.map(escapeValue).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "nexapos-receipt-log.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function downloadReceiptPDF(receipt, settings) {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  const totals = calculateReceiptTotals(receipt);
  let y = 20;

  const line = (label, value, bold = false) => {
    if (y > 265) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(10);
    doc.text(String(label), 15, y);
    doc.text(String(value), 195, y, { align: "right" });
    y += 7;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text(settings.storeName, 15, y);
  y += 11;

  doc.setFontSize(12);
  doc.text("Receipt Audit Copy", 15, y);
  y += 12;

  line("Receipt", receipt.receiptNo, true);
  line("Order", receipt.orderNo);
  line("Date", receipt.date.replace("T", " "));
  line("Cashier", receipt.cashier);
  line("Customer", receipt.customer);
  line("Payment", receipt.payment);
  line("Payment reference", receipt.paymentReference || "Not recorded");
  line("Status", receipt.status);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.text("Purchased Items", 15, y);
  y += 9;

  receipt.items.forEach((item) => {
    const description = `${item.name} (${item.quantity} x ${receiptMoney(item.price)})`;
    const lines = doc.splitTextToSize(description, 135);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    if (y + lines.length * 5 > 265) { doc.addPage(); y = 20; }
    doc.text(lines, 15, y);

    doc.text(receiptMoney(item.subtotal), 195, y, {
      align: "right",
    });

    y += lines.length * 5 + 5;
  });

  y += 5;
  line("Subtotal", receiptMoney(totals.subtotal));
  line("Discount", receiptMoney(totals.discount));
  line("Tax", receiptMoney(totals.tax));
  line("Recorded Total", receiptMoney(receipt.total), true);

  doc.setFontSize(8);
  doc.setTextColor(110);
  doc.text(
    "Receipt generated from saved sales records. Amounts in GHS.",
    15,
    Math.min(y + 14, 280),
  );

  doc.save(`${receipt.receiptNo}-audit.pdf`);
}

export default function Receipts() {
  const { data, loading, error, reload } = useRemoteData(loadReceipts);
  const receipts = data || EMPTY_RECEIPTS;
  const [selectedId, setSelectedId] = useState(null);

  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(() => params.get("search") || "");
  const [dateFilter, setDateFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [settings, setSettings] = useState(defaultSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const filteredReceipts = useMemo(() => {
    return receipts.filter((receipt) => {
      const query = search.trim().toLowerCase();
      const searchable = [
        receipt.receiptNo,
        receipt.orderNo,
        receipt.customer,
        receipt.cashier,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchable.includes(query);
      const matchesPayment =
        paymentFilter === "all" || receipt.paymentMethods.includes(paymentFilter);
      const matchesStatus =
        statusFilter === "all" || receipt.status === statusFilter;

      const matchesDate = receiptMatchesDate(receipt.date, dateFilter);

      return matchesSearch && matchesPayment && matchesStatus && matchesDate;
    });
  }, [receipts, search, dateFilter, paymentFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReceipts.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);

  const pageReceipts = filteredReceipts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const selectedReceipt =
    pageReceipts.find((item) => item.id === selectedId) || pageReceipts[0] || null;

  useEffect(() => {
    if (params.get("print") !== "1" || !selectedReceipt || loading) return;
    const timer = setTimeout(() => {
      window.print();
      api.post(`receipts/${selectedReceipt.id}/reprint/`).catch(() => {});
      setParams({ search: params.get("search") || "" }, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [params, selectedReceipt, loading, setParams]);

  const chooseReceipt = (id) => {
    setSelectedId(id);
    setMessage("");
  };

  const updateFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setDateFilter("all");
    setPaymentFilter("all");
    setStatusFilter("all");
    setPage(1);
  };

  function printReceipt() {
    if (!selectedReceipt) return;
    window.print();
    api.post(`receipts/${selectedReceipt.id}/reprint/`).catch(() => setMessage("Printed locally, but the reprint audit could not be saved."));
  }

  function handleReprint() {
    // A real reprint should also create a backend audit event.
    printReceipt();
  }

  function handleDelivery(channel) {
    if (!selectedReceipt) return;
    setMessage(
      `${channel} delivery is not yet connected to Django. ` +
        `No message has been sent for ${selectedReceipt.receiptNo}.`,
    );
  }

  if (loading || error) return <div role={error ? "alert" : "status"} className="border p-6 text-sm">{error || "Loading receipts..."}{error && <button onClick={reload} className="ml-3 underline">Retry</button>}</div>;

  return (
    <div className="receipts-page min-h-screen bg-white text-black">
      <div className="receipt-screen-content">
        <ReceiptHeader
          onExport={() => exportCSV(filteredReceipts)}
          onSettings={() => setSettingsOpen(true)}
        />

        <div className="flex justify-between border-b p-3 text-xs"><span>Saved Django receipts · GHS · Accra time</span><button onClick={reload} disabled={loading} className="underline">Refresh</button></div>
        <ReceiptStats metrics={[
          { title: "RECEIPTS", value: filteredReceipts.length, note: "Matching filters" },
          { title: "COMPLETED TOTAL", value: receiptMoney(filteredReceipts.filter((r) => r.status === "Completed").reduce((sum, r) => sum + Math.round(r.total * 100), 0) / 100), note: "Matching filters" },
          { title: "COMPLETED", value: filteredReceipts.filter((r) => r.status === "Completed").length, note: "Receipts" },
          { title: "REFUNDED", value: filteredReceipts.filter((r) => r.status === "Refunded").length, note: "Receipts" },
        ]} />

        {message && (
          <div
            role="status"
            className="border-b border-[#ddd] bg-[#f5f5f5] px-3 py-2 text-xs"
          >
            {message}
          </div>
        )}

        <div className="grid min-h-[780px] grid-cols-1 lg:h-[calc(100vh-205px)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Left receipt directory */}
          <section className="flex min-h-[500px] min-w-0 flex-col bg-white lg:min-h-0">
            <ReceiptFilters
              search={search}
              setSearch={(value) => updateFilter(setSearch, value)}
              dateFilter={dateFilter}
              setDateFilter={(value) => updateFilter(setDateFilter, value)}
              paymentFilter={paymentFilter}
              setPaymentFilter={(value) =>
                updateFilter(setPaymentFilter, value)
              }
              statusFilter={statusFilter}
              setStatusFilter={(value) => updateFilter(setStatusFilter, value)}
              count={filteredReceipts.length}
              onClear={clearFilters}
            />

            <ReceiptTable
              receipts={pageReceipts}
              selectedId={selectedReceipt?.id}
              onSelect={chooseReceipt}
            />

            {/* Footer pagination */}
            <div className="flex min-h-[43px] items-center justify-between gap-3 border-t border-[#d8d0d0] bg-[#fafafa] px-3">
              <span className="text-[10px] font-semibold text-[#555]">
                {filteredReceipts.length === 0
                  ? "0"
                  : (currentPage - 1) * PAGE_SIZE + 1}
                {" – "}
                {Math.min(currentPage * PAGE_SIZE, filteredReceipts.length)}
                {" OF "}
                {filteredReceipts.length}
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="border border-[#ddd] bg-white p-2 disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={12} />
                </button>

                <span className="flex h-[29px] min-w-[25px] items-center justify-center bg-black px-2 text-[10px] text-white">
                  {currentPage}
                </span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                  className="border border-[#ddd] bg-white p-2 disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </section>

          {/* Right receipt preview */}
          <ReceiptPreview
            receipt={selectedReceipt}
            settings={settings}
            onPrint={printReceipt}
            onReprint={handleReprint}
            onEmail={() => handleDelivery("Email")}
            onSMS={() => handleDelivery("SMS")}
            onDownloadPDF={() => {
              if (selectedReceipt) {
                downloadReceiptPDF(selectedReceipt, settings);
              }
            }}
          />
        </div>
      </div>

      {/* Print-only thermal receipt */}
      <div className="receipt-print-only">
        <ReceiptPaper receipt={selectedReceipt} settings={settings} />
      </div>

      <ReceiptSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        setSettings={setSettings}
      />
    </div>
  );
}
