import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsHeader({ onExportCSV, onExportPDF }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5">
      <div>
        <h1 className="text-[34px] font-bold leading-tight tracking-tight text-black">
          Reports &amp; Analytics
        </h1>

        <p className="mt-[7px] text-[15px] text-[#666]">
          High-level summaries and interactive charts for store performance.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onExportCSV}
          className="h-[40px] gap-2 rounded-none border-[#988c8c] bg-white px-5 text-[13px] font-semibold text-black shadow-none hover:bg-[#eee]"
        >
          <Download size={15} />
          Export CSV
        </Button>

        <Button
          type="button"
          onClick={onExportPDF}
          className="h-[40px] gap-2 rounded-none bg-black px-5 text-[13px] font-semibold text-white shadow-none hover:bg-[#222]"
        >
          <FileText size={15} />
          Export PDF
        </Button>
      </div>
    </div>
  );
}
