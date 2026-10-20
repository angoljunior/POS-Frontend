import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/data/posData";

export default function POSPaymentDialog({ open, onOpenChange, total, onConfirm, isProcessing, error, customerEmail = "" }) {
  const [method, setMethod] = useState("CASH");
  const [cash, setCash] = useState("");
  const [email, setEmail] = useState(customerEmail);
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("mtn");
  const [reference, setReference] = useState("");
  const valid = Number.isFinite(Number(total)) && Number(total) > 0 && (method === "CASH" ? cash !== "" && Number(cash) >= Number(total) : method === "TRANSFER" ? reference.trim() : email.trim() && (method !== "MOMO" || /^(0|\+?233)[0-9]{9}$/.test(phone)));
  function submit(event) {
    event.preventDefault();
    if (!valid || isProcessing) return;
    onConfirm({ method, ...(method === "CASH" ? { cash_received: cash } : method === "TRANSFER" ? { transfer_reference: reference.trim() } : { email, ...(method === "MOMO" ? { phone, provider } : {}) }) });
  }
  return <Dialog open={open} onOpenChange={(value) => { if (!isProcessing) onOpenChange(value); }}><DialogContent className="max-h-[90vh] overflow-y-auto rounded-none sm:max-w-[440px]">
    <DialogHeader><DialogTitle>Complete payment</DialogTitle><DialogDescription>Amounts confirmed by the store server. Currency: GHS.</DialogDescription></DialogHeader>
    <form onSubmit={submit} className="space-y-4"><div className="bg-muted p-4 text-center"><p className="text-xs">Amount due</p><strong className="text-3xl">{formatCurrency(total)}</strong></div>
      <div className="grid grid-cols-4 gap-1">{[["CASH", "Cash"], ["CARD", "Card"], ["MOMO", "MoMo"], ["TRANSFER", "Transfer"]].map(([key, name]) => <Button key={key} type="button" disabled={isProcessing} variant={method === key ? "default" : "outline"} onClick={() => setMethod(key)} className="rounded-none px-1 text-xs">{name}</Button>)}</div>
      {method === "CASH" ? <><label className="block text-sm">Cash received<Input aria-label="Cash received" type="number" min={total} step="0.01" value={cash} disabled={isProcessing} onChange={(e) => setCash(e.target.value)} required /></label><p className="flex justify-between text-sm"><span>Change due</span><strong>{formatCurrency(Math.max(0, Number(cash) - Number(total)))}</strong></p></> : method === "TRANSFER" ? <><label className="block text-sm">Bank transfer reference<Input value={reference} disabled={isProcessing} onChange={(e) => setReference(e.target.value)} maxLength={200} required /></label><p className="text-xs text-gray-600">A Manager or Accountant must verify bank settlement before this sale completes.</p></> : <><label className="block text-sm">Customer email<Input type="email" value={email} disabled={isProcessing} onChange={(e) => setEmail(e.target.value)} required /></label>{method === "MOMO" ? <><label className="block text-sm">Provider<select className="mt-1 w-full border p-2" value={provider} disabled={isProcessing} onChange={(e) => setProvider(e.target.value)}><option value="mtn">MTN MoMo</option><option value="vod">Telecel Cash</option><option value="atl">ATMoney</option></select></label><label className="block text-sm">Mobile Money number<Input type="tel" value={phone} disabled={isProcessing} onChange={(e) => setPhone(e.target.value)} placeholder="0241234567" required /></label><p className="text-xs text-gray-600">The customer authorises on their phone. Never enter their MoMo PIN here.</p></> : <p className="text-xs text-gray-600">Card details are entered on Paystack's secure payment page.</p>}</>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <DialogFooter><Button type="button" variant="outline" disabled={isProcessing} onClick={() => onOpenChange(false)}>Back</Button><Button type="submit" disabled={!valid || isProcessing}>{isProcessing ? "Processing..." : method === "CASH" ? "Complete cash sale" : "Start payment"}</Button></DialogFooter>
    </form></DialogContent></Dialog>;
}
