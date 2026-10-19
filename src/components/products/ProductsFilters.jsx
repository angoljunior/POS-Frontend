import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductsFilters({
  category,
  setCategory,
  brand,
  setBrand,
  stock,
  setStock,
  search,
  setSearch,
  showMore,
  setShowMore,
  categories,
  brands,
}) {
  return (
    <div className="border border-[#d6cece] bg-[#fafafa] p-[17px]">
      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
        <div className="space-y-[5px]">
          <label className="text-[13px] font-semibold text-[#333]">
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-[43px] w-full rounded-none border-[#d8cece] bg-white px-3 text-[14px] shadow-none">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-[5px]">
          <label className="text-[13px] font-semibold text-[#333]">Brand</label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger className="h-[43px] w-full rounded-none border-[#d8cece] bg-white px-3 text-[14px] shadow-none">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-[5px]">
          <label className="text-[13px] font-semibold text-[#333]">
            Stock Level
          </label>
          <Select value={stock} onValueChange={setStock}>
            <SelectTrigger className="h-[43px] w-full rounded-none border-[#d8cece] bg-white px-3 text-[14px] shadow-none">
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

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowMore(!showMore)}
          aria-expanded={showMore}
          className="h-[43px] gap-2 rounded-none border-[#d8cece] bg-white px-5 font-semibold text-black shadow-none"
        >
          <ListFilter size={16} />
          More Filters
        </Button>
      </div>

      {showMore && (
        <div className="mt-4 border-t border-[#ddd] pt-4">
          <Input
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[42px] max-w-md rounded-none bg-white"
          />
        </div>
      )}
    </div>
  );
}
