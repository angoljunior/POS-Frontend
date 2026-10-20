import { CreditCard } from "lucide-react";
import { formatCurrency } from "@/data/posData";

export default function POSOrderSummary({
  subtotal,
  tax,
  discount,
  total,
  itemCount,
  onPay,
  onDiscount,
  onNote,
  isProcessing,
}) {
  return (
    <div className="border-t border-[#ddd] bg-[#f5f5f5] px-3 py-[10px]">
      <div className="mb-3 grid grid-cols-2 gap-[6px]">
        <button
          type="button"
          onClick={onDiscount}
          className="h-[20px] bg-white text-[10px] font-bold text-black hover:bg-[#e9e9e9]"
        >
          % Discount
        </button>

        <button
          type="button"
          onClick={onNote}
          className="h-[20px] bg-white text-[10px] font-bold text-black hover:bg-[#e9e9e9]"
        >
          Note
        </button>
      </div>

      <div className="space-y-[6px] text-[11px]">
        <div className="flex justify-between text-[#555]">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-[#555]">
            <span>Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-[#555]">
          <span>Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="my-[10px] h-px bg-[#ddd]" />

      <div className="mb-[18px] flex items-center justify-between">
        <span className="text-[15px] font-bold text-black">Total</span>
        <span className="text-[23px] font-extrabold tracking-tight text-black">
          {formatCurrency(total)}
        </span>
      </div>

      <button
        type="button"
        disabled={itemCount === 0 || isProcessing}
        onClick={onPay}
        className="flex h-[45px] w-full items-center justify-center gap-2 bg-black text-[13px] font-bold text-white hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CreditCard size={16} />
        {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
      </button>
    </div>
  );
}
