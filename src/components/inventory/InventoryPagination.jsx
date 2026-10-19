import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InventoryPagination({
  page,
  setPage,
  pageSize,
  totalItems,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;

  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex min-h-[52px] items-center justify-between gap-3 border-t border-[#d7cece] bg-[#e9e9e9] px-[9px] py-2">
      <p className="text-[13px] text-[#555]">
        Showing {start} to {end} of {totalItems} entries
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="h-[34px] w-[27px] rounded-none border-[#d8cdcd] bg-white"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="h-[34px] w-[27px] rounded-none border-[#d8cdcd] bg-white"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
