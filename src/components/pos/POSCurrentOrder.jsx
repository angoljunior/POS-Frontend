import { Trash2 } from "lucide-react";

import POSOrderItem from "./POSOrderItem";
import POSOrderSummary from "./POSOrderSummary";

export default function POSCurrentOrder({
  cart,
  subtotal,
  tax,
  discount,
  total,
  onIncrease,
  onDecrease,
  onQuantityChange,
  onClear,
  onPay,
  onDiscount,
  onNote,
  isProcessing,
}) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-l border-[#dcdcdc] bg-white">
      {/* Order heading */}
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-[#ddd] bg-[#f5f5f5] px-3">
        <h2 className="text-[15px] font-bold text-black">Current Order</h2>

        <button
          type="button"
          onClick={onClear}
          disabled={cart.length === 0 || isProcessing}
          aria-label="Clear current order"
          title="Clear Order"
          className="text-red-600 hover:text-red-800 disabled:opacity-30"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Table headings */}
      <div className="grid h-[26px] shrink-0 grid-cols-[1fr_85px_60px] items-center border-b border-[#ddd] bg-[#fafafa] px-3 text-[9px] text-[#555]">
        <span>Item</span>
        <span className="text-center">Qty</span>
        <span className="text-right">Price</span>
      </div>

      {/* Order items */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <p className="text-sm font-semibold text-[#777]">
              Your cart is empty
            </p>
            <p className="mt-1 text-xs text-[#aaa]">
              Select products to add them to this order.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <POSOrderItem
              key={item.id}
              item={item}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onQuantityChange={onQuantityChange}
            />
          ))
        )}
      </div>

      {/* Bottom summary */}
      <div className="shrink-0">
        <POSOrderSummary
          subtotal={subtotal}
          tax={tax}
          discount={discount}
          total={total}
          itemCount={itemCount}
          onPay={onPay}
          onDiscount={onDiscount}
          onNote={onNote}
          isProcessing={isProcessing}
        />
      </div>
    </aside>
  );
}
