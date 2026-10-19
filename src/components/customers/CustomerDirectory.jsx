import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomerTable from "./CustomerTable";
import CustomerPagination from "./CustomerPagination";

export default function CustomerDirectory({
  customers,
  selectedId,
  onSelect,
  onAdd,
  page,
  setPage,
  pageSize,
  totalItems,
}) {
  return (
    <section className="flex h-full min-h-0 flex-col border border-[#d8cece] bg-white">
      <div className="flex min-h-[85px] flex-wrap items-center justify-between gap-3 border-b border-[#d8cece] bg-[#fafafa] px-[17px] py-3">
        <div>
          <h1 className="text-[21px] font-bold leading-tight text-black">
            Customer Directory
          </h1>
          <p className="mt-1 text-[13px] tracking-wide text-[#555]">
            Manage your active customer base.
          </p>
        </div>

        {onAdd && <Button
          onClick={onAdd}
          className="h-[43px] gap-2 rounded-none bg-black px-5 text-[13px] font-semibold text-white hover:bg-[#292929]"
        >
          <Plus size={17} />
          Add Customer
        </Button>}
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto">
        <CustomerTable
          customers={customers}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>

      <CustomerPagination
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        totalItems={totalItems}
      />
    </section>
  );
}
