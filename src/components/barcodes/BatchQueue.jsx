import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function BatchQueue({
  batch,
  onQuantityChange,
  onRemove,
  onClear,
}) {
  const total = batch.reduce((sum, p) => sum + p.printQty, 0);

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[13px] font-bold tracking-wide">
          BATCH QUEUE
          <span className="ml-1 font-normal text-[#555]">
            ({batch.length} Items / {total} Labels)
          </span>
        </h2>
        <button
          onClick={onClear}
          className="text-[12px] font-semibold tracking-wide text-[#555] hover:text-black"
        >
          CLEAR ALL
        </button>
      </div>

      <div className="grid grid-cols-[1fr_78px_88px_20px] bg-[#e6e6e6] px-2 py-1 text-[12px] font-semibold text-[#666]">
        <span>SKU / ITEM</span>
        <span className="text-center">ON-HAND</span>
        <span className="text-center">PRINT QTY</span>
        <span />
      </div>

      <div className="max-h-[290px] overflow-y-auto">
        {batch.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_78px_88px_20px] items-center gap-0 border-b border-[#eee] px-2 py-3"
          >
            <div className="min-w-0 pr-2">
              <p className="text-[14px] font-bold">{item.sku}</p>
              <p className="truncate text-[13px] text-[#555]">{item.name}</p>
            </div>

            <span className="text-center text-[14px] text-[#555]">
              {item.stock}
            </span>

            <Input
              type="number"
              min="0"
              max="1000"
              value={item.printQty}
              onChange={(e) => onQuantityChange(item.id, e.target.value)}
              aria-label={`Print quantity for ${item.sku}`}
              className="h-[34px] w-[68px] rounded-none border-[#7a899d] bg-[#f4f4f4] text-center"
            />

            <button
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.name}`}
              className="text-[#666] hover:text-red-600"
            >
              <X size={15} />
            </button>
          </div>
        ))}

        {batch.length === 0 && (
          <p className="py-8 text-center text-sm text-[#777]">
            Add a product to start a label batch.
          </p>
        )}
      </div>
    </section>
  );
}
