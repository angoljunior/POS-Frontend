import Barcode from "react-barcode";
import { money } from "@/data/barcodeData";

export default function BarcodeLabel({ product, elements }) {
  if (!product?.sku) return null;

  return (
    <div className="flex h-[150px] min-w-0 flex-col overflow-hidden bg-white px-2 py-2 text-black">
      <div className="flex items-center justify-between gap-2">
        {elements.storeName && (
          <span className="truncate text-[12px] font-extrabold tracking-wide">
            NEXUS POS
          </span>
        )}

        {elements.price && (
          <span className="ml-auto text-[13px] font-bold">
            {money(product.price)}
          </span>
        )}
      </div>

      {elements.productName && (
        <p className="mt-2 truncate text-[13px] font-semibold">
          {product.name}
        </p>
      )}

      <div className="mt-1 flex h-[49px] items-center justify-center overflow-hidden">
        <Barcode
          value={product.barcode || product.sku}
          format="CODE128"
          width={1.45}
          height={36}
          margin={0}
          displayValue={false}
          background="#ffffff"
          lineColor="#000000"
        />
      </div>

      {(elements.sku || elements.readableSku) && (
        <p className="mt-1 text-center font-mono text-[12px] font-semibold tracking-[0.08em]">
          {product.sku}
        </p>
      )}

      {elements.batch && (
        <div className="mt-auto flex justify-between gap-2 text-[10px] tracking-wide text-[#555]">
          <span>LOC: {product.location}</span>
          <span>BATCH: {product.batch}</span>
        </div>
      )}
    </div>
  );
}
