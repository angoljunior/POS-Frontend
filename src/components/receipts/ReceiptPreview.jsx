import {
  Printer,
  RotateCcw,
  Mail,
  MessageSquare,
  FileDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ReceiptPaper from "./ReceiptPaper";

export default function ReceiptPreview({
  receipt,
  settings,
  onPrint,
  onReprint,
  onEmail,
  onSMS,
  onDownloadPDF,
}) {
  return (
    <section className="flex h-full min-h-0 flex-col border-l border-[#d7d0d0] bg-[#f3f3f3]">
      <div className="border-b border-[#d7d0d0] bg-white px-3 py-3">
        <div className="mb-2 flex flex-wrap items-center justify-between">
          <h2 className="text-[15px] font-bold">■ Receipt preview (80mm)</h2>
          <span className="text-[9px] text-[#777]">Browser print</span>
        </div>

        <div className="grid grid-cols-3 gap-1">
          <Button
            disabled={!receipt}
            onClick={onPrint}
            className="h-[30px] gap-1 rounded-none bg-black px-2 text-[9px] font-bold text-white hover:bg-[#222]"
          >
            <Printer size={12} />
            PRINT
          </Button>

          <Button
            disabled={!receipt}
            onClick={onReprint}
            variant="outline"
            className="h-[30px] gap-1 rounded-none px-2 text-[9px]"
          >
            <RotateCcw size={11} />
            REPRINT
          </Button>

          <Button
            disabled={!receipt}
            onClick={onEmail}
            variant="outline"
            className="h-[30px] gap-1 rounded-none px-2 text-[9px]"
          >
            <Mail size={11} />
            EMAIL
          </Button>

          <Button
            disabled={!receipt}
            onClick={onSMS}
            variant="outline"
            className="h-[30px] gap-1 rounded-none px-2 text-[9px]"
          >
            <MessageSquare size={11} />
            SMS
          </Button>

          <Button
            disabled={!receipt}
            onClick={onDownloadPDF}
            variant="outline"
            className="col-span-2 h-[30px] gap-1 rounded-none px-2 text-[9px]"
          >
            <FileDown size={12} />
            DOWNLOAD AUDIT PDF
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {receipt ? (
          <div className="mx-auto max-w-[350px] border border-dashed border-[#bdb6b6] bg-white p-2 shadow-sm">
            <ReceiptPaper receipt={receipt} settings={settings} />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-sm text-[#777]">
            Select a receipt to view its details.
          </div>
        )}
      </div>
    </section>
  );
}
