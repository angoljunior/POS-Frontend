import { Download, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReceiptHeader({ onExport, onSettings }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d5d0d0] bg-white px-2 py-3">
      <div>
        <p className="text-[10px] font-bold tracking-[0.08em] text-[#666]">
          NEXUS CORE // AUDIT &amp; LOGS
          <span className="ml-2 text-black">■ Single store</span>
        </p>

        <h1 className="mt-1 text-[22px] font-bold leading-tight tracking-tight text-black">
          Receipt Management
        </h1>

        <p className="mt-1 text-[12px] text-[#666]">
          Search transaction records, view details, and reprint or dispatch
          thermal receipts.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onExport}
          className="h-9 gap-2 rounded-none border-[#aaa] px-3 text-[10px] font-bold tracking-wide"
        >
          <Download size={13} />
          EXPORT LOG CSV
        </Button>
        <Button
          onClick={onSettings}
          className="h-9 gap-2 rounded-none bg-black px-3 text-[10px] font-bold text-white hover:bg-[#222]"
        >
          <SlidersHorizontal size={13} />
          RECEIPT SETTINGS
        </Button>
      </div>
    </header>
  );
}
