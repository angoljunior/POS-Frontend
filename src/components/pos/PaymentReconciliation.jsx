import { useState } from "react";
import { Button } from "@/components/ui/button";
import { checkoutApi } from "@/api/checkout.api";
import api from "@/api/axios";
import { requestError } from "@/api/directories.api";

export default function PaymentReconciliation({ onSelect }) {
  const [queue, setQueue] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function load() {
    setBusy(true); setError("");
    try { setQueue(await checkoutApi.queue()); }
    catch (e) { setError(requestError(e, "Cannot load reconciliation queue.")); }
    finally { setBusy(false); }
  }
  async function openSale(saleId, paymentId) {
    setBusy(true); setError("");
    try {
      if (!saleId) saleId = (await api.get(`payments/${paymentId}/`)).data.sale;
      onSelect((await api.get(`sales/${saleId}/`)).data);
    } catch (e) { setError(requestError(e, "Cannot load sale.")); }
    finally { setBusy(false); }
  }
  return <section className="space-y-2 border bg-white p-3 text-xs"><div className="flex items-center justify-between gap-2"><span>Unresolved payments & refunds</span><Button size="sm" variant="outline" disabled={busy} onClick={load}>{busy ? "Loading..." : "Review / refresh queue"}</Button></div>{error && <p role="alert" className="text-red-700">{error}</p>}{queue && <div className="max-h-52 space-y-2 overflow-auto">{!queue.payments.length && !queue.refunds.length && <p>No unresolved payments or refunds.</p>}{queue.payments.map((p) => <button key={`p-${p.id}`} disabled={busy} className="block w-full border p-2 text-left hover:bg-muted" onClick={() => openSale(p.sale)}>Payment #{p.id} · {p.method} · {p.status} · GHS {p.amount}</button>)}{queue.refunds.map((r) => <button key={r.id} disabled={busy} className="block w-full border p-2 text-left hover:bg-muted" onClick={() => openSale(null, r.payment)}>Refund · {r.status} · GHS {r.amount}</button>)}</div>}</section>;
}
