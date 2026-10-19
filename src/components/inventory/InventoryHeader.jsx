import { Link } from "react-router-dom";
import { Plus, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InventoryHeader({ onStockAdjustment }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-[34px] font-bold leading-tight tracking-tight text-black">
          Inventory Management
        </h1>

        <p className="mt-1 text-[15px] text-[#666]">
          View current stock levels and availability.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onStockAdjustment && <Button
          type="button"
          variant="outline"
          onClick={onStockAdjustment}
          className="h-[41px] min-w-[195px] gap-2 rounded-none border-[#777] bg-white px-5 text-[13px] font-semibold text-black shadow-none hover:bg-[#f5f5f5]"
        >
          <ListFilter size={15} />
          Stock Adjustment
        </Button>}

        <Button
          asChild
          className="h-[41px] min-w-[160px] gap-2 rounded-none bg-black px-5 text-[13px] font-semibold text-white hover:bg-[#292929]"
        >
          <Link to="/products/new">
            <Plus size={17} />
            New Product
          </Link>
        </Button>
      </div>
    </div>
  );
}
