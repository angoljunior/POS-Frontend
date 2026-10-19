import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import POSCategoryTabs from "@/components/pos/POSCategoryTabs";
import POSProductGrid from "@/components/pos/POSProductGrid";
import POSCurrentOrder from "@/components/pos/POSCurrentOrder";
import POSDiscountDialog from "@/components/pos/POSDiscountDialog";
import POSPaymentDialog from "@/components/pos/POSPaymentDialog";

import { TAX_RATE, formatCurrency } from "@/data/posData";
import { productsCatalogApi } from "@/api/productsCatalog.api";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: "all", name: "All Products" }]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [catalogAttempt, setCatalogAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    productsCatalogApi.getAll().then((data) => {
      if (!active) return;
      setProducts(data.products.filter((product) => product.isActive));
      setCategories([
        { id: "all", name: "All Products" },
        ...data.categories.map((category) => ({ id: category.value, name: category.label })),
      ]);
    }).catch((error) => {
      if (active) setCatalogError(error.response?.data?.detail || "Unable to load products. Check the server connection and try again.");
    }).finally(() => {
      if (active) setCatalogLoading(false);
    });
    return () => { active = false; };
  }, [catalogAttempt]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);

  const [discountOpen, setDiscountOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // Add product to cart
  function addProduct(product) {
    setMessage("");

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, item.stock),
              }
            : item,
        );
      }

      if (product.stock <= 0) return current;

      return [...current, { ...product, quantity: 1 }];
    });
  }

  // Change quantity, respecting available stock.
  function changeQuantity(productId, quantity) {
    if (!Number.isInteger(quantity)) return;

    setCart((current) =>
      current
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.min(Math.max(quantity, 0), item.stock),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function increaseQuantity(productId) {
    const item = cart.find((p) => p.id === productId);
    if (item) changeQuantity(productId, item.quantity + 1);
  }

  function decreaseQuantity(productId) {
    const item = cart.find((p) => p.id === productId);
    if (item) changeQuantity(productId, item.quantity - 1);
  }

  function clearOrder() {
    setCart([]);
    setDiscountPercent(0);
    setNote("");
    setMessage("");
  }

  // Derived totals
  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const discount = subtotal * (discountPercent / 100);
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * TAX_RATE;
    const total = Math.round((taxableAmount + tax) * 100) / 100;

    return {
      subtotal,
      discount,
      tax,
      total,
    };
  }, [cart, discountPercent]);

  // This is a UI demonstration.
  // No payment is recorded in Django.
  function previewCashPayment(cashReceived) {
    setIsProcessing(true);

    const change = cashReceived - totals.total;

    setMessage(
      `Cash preview: ${formatCurrency(cashReceived)} received, ` +
        `${formatCurrency(change)} change due. ` +
        "No sale or payment has been recorded.",
    );

    setPaymentOpen(false);
    setIsProcessing(false);
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white md:flex-row">
      {/* Product catalogue */}
      <div className="flex min-h-[350px] min-w-0 flex-1 flex-col overflow-hidden">
        <POSCategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {message && (
          <div
            role="status"
            className="border-b border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900"
          >
            {message}
          </div>
        )}

        {catalogLoading && <p role="status" className="p-4 text-sm">Loading products...</p>}
        {catalogError && (
          <div role="alert" className="p-4 text-sm text-red-700">
            {catalogError}
            <Button variant="outline" onClick={() => {
              setCatalogError("");
              setCatalogLoading(true);
              setCatalogAttempt((value) => value + 1);
            }}>Retry</Button>
          </div>
        )}
        {!catalogLoading && !catalogError && <POSProductGrid
          products={products}
          selectedCategory={selectedCategory}
          onAddProduct={addProduct}
        />}
      </div>

      {/* Order panel */}
      <div className="h-[480px] w-full shrink-0 md:h-full md:w-[294px] xl:w-[340px]">
        <POSCurrentOrder
          cart={cart}
          {...totals}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onQuantityChange={changeQuantity}
          onClear={clearOrder}
          onDiscount={() => setDiscountOpen(true)}
          onNote={() => setNoteOpen(true)}
          onPay={() => setPaymentOpen(true)}
          isProcessing={isProcessing}
        />
      </div>

      {/* Discount modal */}
      <POSDiscountDialog
        key={`discount-${discountOpen}`}
        open={discountOpen}
        onOpenChange={setDiscountOpen}
        discountPercent={discountPercent}
        onApply={setDiscountPercent}
      />

      {/* Payment modal - frontend preview only */}
      <POSPaymentDialog
        key={`payment-${paymentOpen}`}
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        total={totals.total}
        onConfirm={previewCashPayment}
        isProcessing={isProcessing}
        checkoutSupported={true}
      />

      {/* Order note modal */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Order Note</DialogTitle>
          </DialogHeader>

          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add any special instructions..."
            rows={4}
          />

          <DialogFooter>
            <Button type="button" onClick={() => setNoteOpen(false)}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
