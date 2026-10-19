import { Link } from "react-router-dom";
import { Download, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function ProductsHeader({ onExport, onImport }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#d7d1d1] pb-[16px]">
      <div>
        <h1 className="text-[32px] font-bold leading-tight tracking-tight text-black">
          Products
        </h1>

        <p className="mt-[5px] text-[15px] text-[#666]">
          Manage your inventory catalog, pricing, and availability.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-[43px] gap-2 rounded-none border-[#d6caca] bg-white px-5 text-[13px] font-semibold text-black shadow-none"
            >
              <Download size={15} />
              Import/Export
              <ChevronDown size={15} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onImport}>
              Import Products (CSV)
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onExport}>
              Export Products (CSV)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          asChild
          className="h-[43px] rounded-none bg-black px-6 text-[13px] font-semibold text-white hover:bg-[#292929]"
        >
          <Link to="/products/new">
            <Plus size={17} />
            Add New Product
          </Link>
        </Button>
      </div>
    </div>
  );
}
