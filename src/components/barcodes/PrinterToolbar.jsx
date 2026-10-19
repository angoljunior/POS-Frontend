import { ChevronLeft, ChevronRight, Minus, Plus, Printer } from "lucide-react";

export default function PrinterToolbar({
  page,
  totalPages,
  setPage,
  zoom,
  setZoom,
}) {
  return (
    <div className="space-y-2 bg-white p-2">
      <div className="flex flex-wrap items-center gap-2">
        <Printer size={17} className="text-[#666]" />

        <span className="border border-[#8d98a8] bg-[#f8f8f8] px-3 py-2 text-[12px] font-semibold">
          Zebra ZD420 (Thermal Roll 203dpi)
        </span>

        <button
          className="bg-[#f2f2f2] p-2"
          onClick={() => setZoom(Math.max(50, zoom - 10))}
          aria-label="Zoom out"
        >
          <Minus size={16} />
        </button>

        <span className="text-[14px] text-[#555]">{zoom}%</span>

        <button
          className="bg-[#f2f2f2] p-2"
          onClick={() => setZoom(Math.min(150, zoom + 10))}
          aria-label="Zoom in"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-[#f2f2f2] p-2 disabled:opacity-30"
          aria-label="Previous sheet"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-[13px] font-semibold">
          Sheet {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-[#f2f2f2] p-2 disabled:opacity-30"
          aria-label="Next sheet"
        >
          <ChevronRight size={16} />
        </button>

        <span className="ml-2 bg-[#f2f2f2] px-2 py-1 text-[12px] font-semibold text-[#555]">
          2" × 1" DIE-CUT
        </span>
      </div>
    </div>
  );
}
