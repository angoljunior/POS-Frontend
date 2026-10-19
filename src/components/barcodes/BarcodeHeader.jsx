import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BarcodeHeader({ totalLabels, onDownload, onPrint }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 bg-[#f5f5f5] px-4 py-4">
      <div>
        <p className="mb-1 text-[12px] font-semibold tracking-[0.08em] text-[#555]">
          INVENTORY OPERATIONS
          <span className="mx-3 text-[#ccc]">/</span>
          <span className="text-black">PRINT ENGINE V4.2</span>
        </p>

        <h1 className="text-[25px] font-bold tracking-tight text-black">
          Barcode &amp; Label Management
        </h1>

        <p className="mt-1 max-w-[600px] text-[14px] leading-[22px] text-[#666]">
          Generate, preview, customize, and batch-print high-contrast barcode
          labels for physical store inventory and packaging.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={onDownload}
          disabled={!totalLabels}
          className="min-h-[51px] gap-3 rounded-none border-0 bg-white px-5 text-[12px] font-bold tracking-wide text-black hover:bg-[#eaeaea]"
        >
          <Download size={17} />
          <span>
            DOWNLOAD PDF
            <br />
            LABELS
          </span>
        </Button>

        <Button
          onClick={onPrint}
          disabled={!totalLabels}
          className="min-h-[51px] min-w-[190px] gap-3 rounded-none bg-black px-5 text-[12px] font-bold tracking-wide text-white hover:bg-[#222]"
        >
          <Printer size={17} />
          PRINT ALL
          <br />
          SELECTED ({totalLabels})
        </Button>
      </div>
    </header>
  );
}
