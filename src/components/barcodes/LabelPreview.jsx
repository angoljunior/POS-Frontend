import BarcodeLabel from "./BarcodeLabel";
import { LABELS_PER_SHEET } from "@/data/barcodeData";

export default function LabelPreview({ labels, elements, zoom }) {
  const placeholders = Math.max(0, LABELS_PER_SHEET - labels.length);

  return (
    <div className="overflow-auto bg-white p-4 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-[12px] font-semibold tracking-wide text-[#555]">
        <span>SHEET FORMAT: AVERY 5160 / 2-UP ROLL EMULATION</span>
        <span>MARGIN: 4.2MM • GAP: 2.5MM</span>
      </div>

      <div className="overflow-hidden">
        <div
          className="grid grid-cols-2 gap-x-3 gap-y-6"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top left",
            width: `${10000 / zoom}%`,
          }}
        >
          {labels.map((product, index) => (
            <BarcodeLabel
              key={`${product.id}-${index}`}
              product={product}
              elements={elements}
            />
          ))}

          {Array.from({ length: placeholders }).map((_, i) => (
            <div key={`empty-${i}`} className="h-[150px] bg-[#fafafa]" />
          ))}
        </div>
      </div>
    </div>
  );
}
