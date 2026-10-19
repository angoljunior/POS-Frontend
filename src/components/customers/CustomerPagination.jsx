import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerPagination({
  page,
  setPage,
  pageSize,
  totalItems,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;

  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex min-h-[50px] shrink-0 items-center justify-between border-t border-[#d8cece] bg-[#f8f8f8] px-[10px]">
      <p className="text-[12px] tracking-wide text-[#555]">
        Showing {start}-{end} of {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          aria-label="Previous page"
          className="h-8 w-7 rounded-none"
        >
          <ChevronLeft size={16} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          aria-label="Next page"
          className="h-8 w-7 rounded-none"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
