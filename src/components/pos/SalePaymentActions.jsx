import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { checkoutApi, notifyPOSDataChanged } from "@/api/checkout.api";
import { requestError } from "@/api/directories.api";
import api from "@/api/axios";
import { saleMoney } from "@/api/salesHistory.api";

export default function SalePaymentActions({ sale, onUpdated }) {
  const { user, hasPermission } = useAuth();
  const [reference, setReference] = useState("");
  const [reason, setReason] = useState("");
  const [quantities, setQuantities] = useState({});
  const [restock, setRestock] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [refundRequest, setRefundRequest] = useState(null);
  const payment = sale.payments?.[0];
  async function action(run) {
    if (busy) return;
    setBusy(true); setError("");
    try { await run(); const { data } = await api.get(`sales/${sale.id}/`); onUpdated(data); notifyPOSDataChanged(); }
    catch (e) { setError(requestError(e, "Unable to complete this action.")); }
    finally { setBusy(false); }
  }
  if (!payment) return <p className="text-xs">No payment recorded.</p>;
  const canVerify = sale.cashier === user.id || hasPermission("payments.reconcile");
  return <section className="space-y-3 border-t pt-4 text-sm"><h3 className="font-semibold">Payment & returns</h3><p>{payment.method} · {payment.status} · {saleMoney(payment.amount)}</p><p className="break-all text-xs text-gray-500">{payment.reference}</p>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {["PENDING", "PROCESSING"].includes(payment.status) && <div className="space-y-2">
      {payment.method !== "TRANSFER" && canVerify && <Button disabled={busy} onClick={() => action(() => checkoutApi.status(payment.id, true))}>Verify with Paystack</Button>}
      {payment.method === "TRANSFER" && hasPermission("payments.confirm") && <><p className="text-xs">Confirm only after checking settlement in the bank account. Submitted reference: {payment.settlement_reference}</p><Input aria-label="Verified settlement reference" placeholder="Enter verified bank settlement reference" value={reference} onChange={(e) => setReference(e.target.value)} /><div className="flex flex-wrap gap-2"><Button disabled={busy || !reference.trim()} onClick={() => action(() => checkoutApi.confirmTransfer(payment.id, reference))}>Confirm settled transfer</Button><Button variant="outline" disabled={busy} onClick={() => { if (window.confirm("Cancel this unsettled transfer and release its reserved stock?")) action(() => checkoutApi.cancelTransfer(payment.id)); }}>Cancel unsettled transfer</Button></div></>}
    </div>}
    {hasPermission("sales.refund") && <>
      {(sale.refunds || []).map((refund) => <div key={refund.id} className="space-y-2 border bg-muted/30 p-3 text-xs"><p>Refund {saleMoney(refund.amount)} · {refund.status} · {refund.restocked ? "Restocked" : "Not restocked"}</p><p>{refund.reason}</p>{refund.status !== "SUCCESS" && <>{payment.method === "CARD" || payment.method === "MOMO" ? <Button size="sm" variant="outline" disabled={busy} onClick={() => action(() => checkoutApi.reconcileRefund(refund.id))}>Reconcile refund status</Button> : <><Input placeholder="Cash payout / bank refund reference" aria-label="Refund settlement reference" value={reference} onChange={(e) => setReference(e.target.value)} /><Button size="sm" disabled={busy || !reference.trim()} onClick={() => { if (window.confirm("Confirm the customer has received this refund?")) action(() => checkoutApi.confirmRefund(refund.id, reference)); }}>Confirm refund paid</Button></>}</>}</div>)}
      {payment.status === "SUCCESS" && <div className="space-y-2 border p-3"><h4 className="font-semibold">Full or partial refund</h4><p className="text-xs text-gray-500">Choose returned quantities. Django calculates the refund including allocated discounts and tax.</p>{sale.items.map((item) => <label key={item.id} className="flex items-center justify-between gap-2 text-xs"><span>{item.product_name} (sold: {item.quantity})</span><Input aria-label={`Refund quantity ${item.product_name}`} className="w-20" type="number" min="0" max={item.quantity} disabled={busy || Boolean(refundRequest)} value={quantities[item.id] || 0} onChange={(e) => setQuantities({ ...quantities, [item.id]: Number(e.target.value) })} /></label>)}<Input placeholder="Refund reason" aria-label="Refund reason" disabled={busy || Boolean(refundRequest)} value={reason} onChange={(e) => setReason(e.target.value)} /><label className="flex gap-2 text-xs"><input type="checkbox" checked={restock} disabled={busy || Boolean(refundRequest)} onChange={(e) => setRestock(e.target.checked)} />I approve these returned products as sellable; restock after refund succeeds.</label><Button disabled={busy || !reason.trim() || !Object.values(quantities).some((v) => v > 0)} onClick={() => {
        const payload = refundRequest || { payment_id: payment.id, idempotency_key: crypto.randomUUID(), items: Object.entries(quantities).filter(([, q]) => q > 0).map(([id, q]) => ({ sale_item_id: Number(id), quantity: q })), reason, restock };
        setRefundRequest(payload);
        action(async () => { await checkoutApi.refund(payload); setRefundRequest(null); setQuantities({}); setReason(""); });
      }}>{refundRequest ? "Retry same refund request" : "Request refund"}</Button></div>}
    </>}
  </section>;
}
