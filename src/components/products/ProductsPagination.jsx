import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsPagination({
  page,
  setPage,
  totalItems,
  pageSize,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const first = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;

  const last = Math.min(page * pageSize, totalItems);

  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, index) => {
    const start = Math.min(Math.max(1, page - 1), Math.max(1, totalPages - 2));
    return start + index;
  });

  return (
    <div className="flex min-h-[52px] flex-wrap items-center justify-between gap-3 border-t border-[#d7cccc] bg-[#e9e9e9] px-[17px] py-2">
      <p className="text-[13px] font-medium tracking-wide text-[#666]">
        Showing {first}-{last} of {totalItems} items
      </p>

      <div className="flex items-center gap-[5px]">
        <Button
          variant="outline"
          size="icon"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="h-[34px] w-[34px] rounded-none border-[#d6cccc] bg-white"
        >
          <ChevronLeft size={15} />
        </Button>

        {pages.map((number) => (
          <Button
            key={number}
            variant="outline"
            onClick={() => setPage(number)}
            className={`h-[34px] w-[34px] rounded-none border-[#d6cccc] p-0 text-[13px] ${
              page === number
                ? "bg-black font-semibold text-white hover:bg-black hover:text-white"
                : "bg-white text-black"
            }`}
          >
            {number}
          </Button>
        ))}

        {totalPages > 3 && <span className="px-2 text-[#555]">...</span>}

        <Button
          variant="outline"
          size="icon"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="h-[34px] w-[34px] rounded-none border-[#d6cccc] bg-white"
        >
          <ChevronRight size={15} />
        </Button>
      </div>
    </div>
  );
}
