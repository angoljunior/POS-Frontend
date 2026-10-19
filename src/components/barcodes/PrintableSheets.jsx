import Barcode from "react-barcode";
import { money } from "@/data/barcodeData";

export default function PrintableSheets({ labels, elements }) {
  return (
    <div className="barcode-print-document">
      {labels.map((item, index) => (
        <div key={`${item.id}-${index}`} className="barcode-print-label">
          <div className="flex justify-between gap-1 font-bold">
            <span>{elements.storeName ? "NEXUS POS" : ""}</span>
            <span>{elements.price ? money(item.price) : ""}</span>
          </div>

          {elements.productName && (
            <p className="truncate font-semibold">{item.name}</p>
          )}

          <div className="barcode-print-bars">
            <Barcode
              value={item.barcode || item.sku}
              format="CODE128"
              width={1}
              height={27}
              margin={0}
              displayValue={false}
            />
          </div>

          {(elements.sku || elements.readableSku) && (
            <p className="text-center font-mono">{item.sku}</p>
          )}

          {elements.batch && (
            <p className="truncate">
              {item.location} / {item.batch}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
