import { Minus, Plus } from "lucide-react";
import { formatCurrency } from "@/data/posData";

export default function POSOrderItem({
  item,
  onIncrease,
  onDecrease,
  onQuantityChange,
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-[#e2dada] px-3 py-[8px]">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium text-black">
          {item.name}
        </p>
        <p className="text-[10px] text-[#555]">SKU: {item.sku}</p>
      </div>

      <div className="flex shrink-0 items-center gap-[5px]">
        <button
          type="button"
          onClick={() => onDecrease(item.id)}
          className="flex h-6 w-4 items-center justify-center text-black hover:bg-gray-100"
          aria-label={`Decrease ${item.name}`}
        >
          <Minus size={11} />
        </button>

        <input
          type="number"
          min="1"
          max={item.stock}
          value={item.quantity}
          onChange={(event) =>
            onQuantityChange(item.id, Number(event.target.value))
          }
          aria-label={`Quantity for ${item.name}`}
          className="h-[20px] w-[26px] border border-[#d4d4d4] bg-white text-center text-[11px] text-black outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        <button
          type="button"
          onClick={() => onIncrease(item.id)}
          disabled={item.quantity >= item.stock}
          className="flex h-6 w-4 items-center justify-center text-black hover:bg-gray-100 disabled:opacity-30"
          aria-label={`Increase ${item.name}`}
        >
          <Plus size={11} />
        </button>
      </div>

      <p className="w-[58px] shrink-0 text-right text-[11px] font-bold text-black">
        {formatCurrency(item.price * item.quantity)}
      </p>
    </div>
  );
}
