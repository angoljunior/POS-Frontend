import { Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InventoryFilters({
  stockStatus,
  onStockStatusChange,
  onExport,
  onPrint,
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border border-[#d9cece] bg-white px-[17px] py-[17px]">
      <div className="grid w-full grid-cols-1 gap-[17px] sm:w-auto sm:grid-cols-2">
        <div className="w-full space-y-[5px] sm:w-[272px]">
          <label className="block text-[13px] font-semibold tracking-wide text-[#666]">
            Branch / Location
          </label>

          <Select value="all" disabled>
            <SelectTrigger className="h-[41px] w-full rounded-none border-[#d6cdcd] bg-white text-[14px] shadow-none">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full space-y-[5px] sm:w-[272px]">
          <label className="block text-[13px] font-semibold tracking-wide text-[#666]">
            Stock Status
          </label>

          <Select value={stockStatus} onValueChange={onStockStatusChange}>
            <SelectTrigger className="h-[41px] w-full rounded-none border-[#d6cdcd] bg-white text-[14px] shadow-none">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="in">In Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onExport}
          aria-label="Export inventory"
          title="Export Inventory"
          className="h-[45px] w-[45px] rounded-none border-[#d6cdcd] bg-white shadow-none"
        >
          <Download size={19} />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onPrint}
          aria-label="Print inventory"
          title="Print Inventory"
          className="h-[45px] w-[45px] rounded-none border-[#d6cdcd] bg-white shadow-none"
        >
          <Printer size={20} />
        </Button>
      </div>
    </div>
  );
}
