import { useEffect, useState } from "react";
import { checkoutApi } from "@/api/checkout.api";
import { saveCustomer, requestError } from "@/api/directories.api";
import { useAuth } from "@/context/AuthContext";
import CustomerFormDialog from "@/components/customers/CustomerFormDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function POSCustomerSelector({ selected, onSelect, disabled }) {
  const { hasPermission } = useAuth();
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!query.trim() || disabled) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      setError("");
      checkoutApi.customers(query, controller.signal).then(setRows).catch((e) => {
        if (!controller.signal.aborted) setError(requestError(e, "Customer search failed."));
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, disabled]);
  return <div className="space-y-2 border-b p-3 text-xs">
    <div className="flex items-center justify-between gap-2"><strong>{selected ? `${selected.first_name} ${selected.last_name}` : "Walk-in customer"}</strong><Button size="sm" variant="ghost" disabled={disabled} onClick={() => { onSelect(null); setQuery(""); }}>Walk-in</Button></div>
    <Input aria-label="Search customers" disabled={disabled} placeholder="Search name, phone or email" value={query} onChange={(e) => { setQuery(e.target.value); setRows([]); }} className="h-8 rounded-none text-xs" />
    {query.trim() && !disabled && <div className="max-h-28 overflow-auto" aria-live="polite">{loading ? "Searching..." : rows.length ? rows.map((customer) => <button key={customer.id} className="block w-full border-b p-2 text-left hover:bg-muted" onClick={() => { onSelect(customer); setQuery(""); }}>{customer.first_name} {customer.last_name}<span className="block text-gray-500">{customer.phone || customer.email}</span></button>) : "No matching customers."}</div>}
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {hasPermission("customers.create") && <Button variant="outline" size="sm" disabled={disabled} onClick={() => setOpen(true)}>Register customer</Button>}
    <CustomerFormDialog key={String(open)} open={open} onOpenChange={setOpen} onSave={async (fields) => { const customer = await saveCustomer(null, fields); onSelect(customer); setQuery(""); }} />
  </div>;
}
