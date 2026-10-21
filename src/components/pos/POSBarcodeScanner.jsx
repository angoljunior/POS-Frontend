import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/api/axios";
import { createScanQueue } from "@/lib/scanner";

export default function POSBarcodeScanner({ disabled, onProduct, onPendingChange }) {
  const input = useRef(null);
  const callbacks = useRef({ onProduct, onPendingChange });
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(0);
  useLayoutEffect(() => { callbacks.current = { onProduct, onPendingChange }; });
  const queue = useRef(null);
  useEffect(() => {
    queue.current = createScanQueue(
    async (code) => (await api.get("products/lookup/", { params: { code } })).data,
    (product) => { callbacks.current.onProduct(product); setMessage(`${product.name} added.${product.warning ? ` ${product.warning}` : ""}`); },
    setMessage,
    (count) => { setPending(count); callbacks.current.onPendingChange(count > 0); },
    );
    return () => queue.current.cancel();
  }, []);
  useEffect(() => {
    if (disabled) { queue.current.cancel(); return; }
    // Never capture global typing or take focus from a customer/payment field.
    const timer = setTimeout(() => {
      if (!document.querySelector('[role="dialog"]') && (!document.activeElement || document.activeElement === document.body)) input.current?.focus();
    }, 0);
    return () => { clearTimeout(timer); queue.current.cancel(); };
  }, [disabled]);
  function submit(event) {
    event.preventDefault();
    if (disabled) return;
    const code = input.current.value;
    input.current.value = "";
    input.current.focus();
    void queue.current.enqueue(code);
  }
  return <section className="space-y-2 border-b bg-slate-50 p-3">
    <form onSubmit={submit} className="flex items-end gap-2">
      <div className="flex-1"><label htmlFor="pos-barcode" className="mb-1 block text-sm font-medium">Scan barcode or enter SKU</label>
        <Input ref={input} id="pos-barcode" name="barcode" disabled={disabled} autoComplete="off" spellCheck={false} placeholder="Scan or type, then press Enter" aria-describedby="barcode-status" onKeyDown={(e) => { if (e.key === "Enter" && e.nativeEvent.isComposing) e.preventDefault(); }} /></div>
      <Button type="submit" disabled={disabled}>Add</Button>
      <Button type="button" variant="outline" disabled={disabled} onClick={() => input.current?.focus()}>Focus scanner</Button>
    </form>
    <p id="barcode-status" role="status" aria-live="polite" className="text-sm">{message || "USB/Bluetooth keyboard scanners: use the Enter suffix."}{pending > 0 && ` Processing ${pending} scan(s)…`}</p>
  </section>;
}
