import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import POSCategoryTabs from "@/components/pos/POSCategoryTabs";
import POSProductGrid from "@/components/pos/POSProductGrid";
import POSCurrentOrder from "@/components/pos/POSCurrentOrder";
import POSDiscountDialog from "@/components/pos/POSDiscountDialog";
import POSPaymentDialog from "@/components/pos/POSPaymentDialog";
import POSCustomerSelector from "@/components/pos/POSCustomerSelector";
import { productsCatalogApi } from "@/api/productsCatalog.api";
import { checkoutApi, checkoutCompleted, notifyPOSDataChanged } from "@/api/checkout.api";
import { requestError } from "@/api/directories.api";
import { formatCurrency } from "@/data/posData";
import { useAuth } from "@/context/AuthContext";

function readDraft(key) {
  try { return JSON.parse(sessionStorage.getItem(key)) || {}; } catch { return {}; }
}

export default function POS() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const storageKey = `nexapos-checkout-${user.id}`;
  const [draft, setDraft] = useState(() => readDraft(storageKey));
  const cart = draft.cart || [];
  const customer = draft.customer || null;
  const discount = draft.discount || 0;
  const attempt = draft.attempt;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: "all", name: "All Products" }]);
  const [category, setCategory] = useState("all");
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [catalogVersion, setCatalogVersion] = useState(0);
  const [quote, setQuote] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sale, setSale] = useState(null);
  const [success, setSuccess] = useState(null);
  const checkoutGeneration = useRef(0);
  const locked = busy || Boolean(attempt);
  const saveDraft = useCallback((next) => {
    setDraft(next);
    sessionStorage.setItem(storageKey, JSON.stringify(next));
  }, [storageKey]);
  useEffect(() => {
    let active = true;
    productsCatalogApi.getAll().then((data) => {
      if (!active) return;
      setProducts(data.products.filter((p) => p.isActive));
      setCategories([{ id: "all", name: "All Products" }, ...data.categories.map((c) => ({ id: c.value, name: c.label }))]);
      setCatalogError("");
    }).catch((e) => { if (active) setCatalogError(requestError(e, "Unable to load products.")); }).finally(() => { if (active) setCatalogLoading(false); });
    return () => { active = false; };
  }, [catalogVersion]);
  const acceptSale = useCallback((result) => {
    setSale(result);
    if (result.payments?.some((p) => ["FAILED", "CANCELLED"].includes(p.status))) {
      saveDraft({ ...JSON.parse(sessionStorage.getItem(storageKey) || "{}"), attempt: null });
      setQuote(null);
      setError("The previous payment failed or was cancelled. Edit your cart and choose Pay to start a new attempt.");
      setCatalogVersion((v) => v + 1);
    }
    if (checkoutCompleted(result)) {
      setSuccess(result);
      saveDraft({});
      setPaymentOpen(false);
      setQuote(null);
      setCatalogVersion((v) => v + 1);
      notifyPOSDataChanged();
    }
  }, [saveDraft, storageKey]);
  useEffect(() => {
    if (!attempt) return;
    let active = true;
    let timer;
    const generation = checkoutGeneration.current;
    let checks = 0;
    async function refresh() {
      try {
        const current = await checkoutApi.byKey(attempt.idempotency_key);
        if (!active || generation !== checkoutGeneration.current) return;
        setSale(current);
        const payment = current.payments?.[0];
        const result = payment && !["SUCCESS", "REFUNDED", "FAILED", "CANCELLED"].includes(payment.status)
          ? await checkoutApi.status(payment.id, payment.method !== "TRANSFER") : current;
        if (active && generation === checkoutGeneration.current) acceptSale(result);
      } catch (e) {
        if (active && generation === checkoutGeneration.current && e.response?.status !== 404) setError(requestError(e, "Unable to verify payment. The cart is preserved."));
      } finally {
        if (active && ++checks < 24) timer = setTimeout(refresh, 8000);
      }
    }
    refresh();
    return () => { active = false; clearTimeout(timer); };
  }, [attempt, acceptSale]);
  function updateCart(next) { if (!locked) { saveDraft({ ...draft, cart: next }); setQuote(null); setError(""); } }
  function addProduct(product) {
    if (locked || product.stock <= 0) return;
    const found = cart.find((i) => i.id === product.id);
    updateCart(found ? cart.map((i) => i.id === product.id ? { ...i, quantity: Math.min(i.quantity + 1, product.stock) } : i) : [...cart, { ...product, quantity: 1 }]);
  }
  function quantity(id, value) {
    if (!Number.isInteger(value)) return;
    updateCart(cart.map((i) => i.id === id ? { ...i, quantity: Math.max(0, Math.min(value, i.stock)) } : i).filter((i) => i.quantity > 0));
  }
  async function openPayment() {
    if (locked || !cart.length) return;
    setBusy(true); setError("");
    try { setQuote(await checkoutApi.quote(cart.map((i) => ({ product_id: i.id, quantity: i.quantity })), discount)); setPaymentOpen(true); }
    catch (e) { setError(requestError(e, "Unable to calculate amount due.")); }
    finally { setBusy(false); }
  }
  async function submit(details) {
    if (busy) return;
    const payload = attempt || { ...details, items: cart.map((i) => ({ product_id: i.id, quantity: i.quantity })), customer_id: customer?.id || null, expected_total: quote?.total, discount_percent: discount, note: draft.note || "", idempotency_key: crypto.randomUUID() };
    // Persist the exact request before sending. Retries keep its original key.
    saveDraft({ ...draft, attempt: payload });
    setBusy(true); setError("");
    try { acceptSale(await checkoutApi.submit(payload)); setPaymentOpen(false); }
    catch (e) {
      setError(requestError(e, "Payment could not be confirmed. Retry this same request."));
      if (!attempt && [400, 403].includes(e.response?.status)) saveDraft({ ...draft, attempt: null });
    } finally { setBusy(false); }
  }
  async function checkStatus() {
    if (busy) return;
    setBusy(true); setError("");
    try { const current = await checkoutApi.byKey(attempt.idempotency_key); setSale(current); acceptSale(await checkoutApi.status(current.payments[0].id, current.payments[0].method !== "TRANSFER")); }
    catch (e) { setError(requestError(e, "Unable to check payment.")); }
    finally { setBusy(false); }
  }
  async function cancelTestAttempt() {
    if (busy) return;
    setBusy(true); setError("");
    try { acceptSale(await checkoutApi.cancelTestPayment(sale.payments[0].id)); }
    catch (e) { setError(requestError(e, "Unable to cancel this test attempt.")); }
    finally { setBusy(false); }
  }
  function startSeparateCheckout() {
    if (busy || !sale) return;
    checkoutGeneration.current += 1;
    // The unresolved order remains in Django and can be reconciled in Sales.
    saveDraft({});
    setSale(null);
    setQuote(null);
    setPaymentOpen(false);
    setError("");
    setCatalogVersion((v) => v + 1);
    notifyPOSDataChanged();
  }
  const payment = sale?.payments?.[0];
  const terminalFailure = payment && ["FAILED", "CANCELLED"].includes(payment.status);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const displayed = quote || { subtotal, discount: subtotal * discount / 100, tax: 0, total: subtotal * (1 - discount / 100) };
  return <div className="flex h-full min-h-0 flex-col bg-white md:flex-row">
    <div className="flex min-h-[350px] min-w-0 flex-1 flex-col overflow-auto"><POSCategoryTabs categories={categories} selectedCategory={category} onCategoryChange={setCategory} />
      {error && <p role="alert" className="border-b bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {attempt && <div role="status" className="space-y-2 border-b bg-amber-50 p-4 text-sm"><strong>Payment {payment?.status || "awaiting confirmation"}</strong><p className="break-all">{payment?.reference || attempt.idempotency_key}</p><p>{payment?.instructions || "The order is preserved. Check the existing payment before retrying."}</p>
        {payment?.authorization_url && <a className="inline-block border bg-black px-3 py-2 text-white" href={payment.authorization_url} target="_blank" rel="noopener noreferrer">Open secure Paystack payment</a>}
        <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" disabled={busy} onClick={checkStatus}>Check payment status</Button>{!terminalFailure && <Button size="sm" disabled={busy} onClick={() => submit({})}>Retry same request</Button>}{payment?.test_retry_allowed && <Button size="sm" variant="outline" disabled={busy} onClick={cancelTestAttempt}>Cancel stuck test payment</Button>}{terminalFailure && <Button size="sm" onClick={() => { saveDraft({ ...draft, attempt: null }); setSale(null); setError(""); }}>Retry with a new payment</Button>}</div>
        {!terminalFailure && <div className="space-y-2"><p className="text-xs">This payment is unconfirmed. You can start a separate sale; this order and its reserved stock stay saved in Sales for reconciliation. Do not charge the same purchase again until its status is resolved.</p><Button size="sm" variant="outline" disabled={busy || !sale} onClick={startSeparateCheckout}>Save pending order and start new sale</Button><Button size="sm" variant="outline" disabled={busy} onClick={() => navigate("/sales")}>View saved sales</Button></div>}
      </div>}
      {catalogLoading && <p className="p-4">Loading products...</p>}{catalogError && <div className="p-4 text-red-700">{catalogError}<Button onClick={() => setCatalogVersion((v) => v + 1)}>Retry</Button></div>}
      {!catalogLoading && !catalogError && <POSProductGrid products={products} selectedCategory={category} onAddProduct={addProduct} />}
    </div>
    <div className="flex h-[650px] w-full shrink-0 flex-col md:h-full md:w-[340px]">
      <POSCustomerSelector selected={customer} disabled={locked} onSelect={(selected) => saveDraft({ ...draft, customer: selected })} />
      <div className="min-h-0 flex-1"><POSCurrentOrder cart={cart} {...displayed} onIncrease={(id) => quantity(id, cart.find((i) => i.id === id).quantity + 1)} onDecrease={(id) => quantity(id, cart.find((i) => i.id === id).quantity - 1)} onQuantityChange={quantity} onClear={() => { if (!locked) saveDraft({}); }} onDiscount={() => { if (!locked && hasPermission("sales.discount")) setDiscountOpen(true); }} onNote={() => { if (!locked) { const note = window.prompt("Order note", draft.note || ""); if (note !== null) saveDraft({ ...draft, note: note.slice(0, 500) }); } }} onPay={openPayment} isProcessing={locked} /></div>
      {!quote && <p className="border-t p-2 text-[10px] text-gray-600">Estimated total. Tax and prices are checked before payment.</p>}
    </div>
    <POSDiscountDialog key={String(discountOpen)} open={discountOpen} onOpenChange={setDiscountOpen} discountPercent={discount} onApply={(value) => { saveDraft({ ...draft, discount: value }); setQuote(null); }} />
    <POSPaymentDialog key={String(paymentOpen)} open={paymentOpen} onOpenChange={setPaymentOpen} total={quote?.total} customerEmail={customer?.email || ""} onConfirm={submit} isProcessing={busy} error={error} />
    <Dialog open={Boolean(success)} onOpenChange={(open) => { if (!open) setSuccess(null); }}><DialogContent className="rounded-none"><DialogHeader><DialogTitle>Payment confirmed</DialogTitle><DialogDescription>The sale is saved, stock updated and receipt generated.</DialogDescription></DialogHeader><p className="text-2xl font-bold">{formatCurrency(success?.total || 0)}</p>{success?.payments?.[0]?.method === "CASH" && <p>Change due: {formatCurrency(success.payments[0].change_due)}</p>}<div className="flex flex-wrap gap-2"><Button onClick={() => navigate(`/receipts?search=${success.id}&print=1`)}>Print Receipt</Button><Button variant="outline" onClick={() => navigate(`/receipts?search=${success.id}`)}>View Receipt</Button><Button variant="outline" onClick={() => { setSuccess(null); setSale(null); }}>New Sale</Button></div></DialogContent></Dialog>
  </div>;
}
