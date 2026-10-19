import { Link } from "react-router-dom";
import { Package, MoreHorizontal, Pencil, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import StockBadge from "./StockBadge";
import { formatPrice } from "@/data/productsData";

export default function ProductRow({ product, selected, onSelect }) {
  return (
    <tr className="h-[77px] border-b border-[#d8d0d0] even:bg-[#f7f7f7] last:[border-bottom-width:0]">
      <td className="w-[50px] px-[17px]">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(product.id, checked === true)}
          aria-label={`Select ${product.name}`}
          className="rounded-[2px] border-[#d5caca]"
        />
      </td>

      <td className="w-[80px] px-2">
        <div className="flex h-[43px] w-[43px] items-center justify-center border border-[#d6caca] bg-[#f5f5f5]">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <Package className="h-6 w-6 text-[#666]" />
          )}
        </div>
      </td>

      <td className="min-w-[230px] px-3 text-[14px] font-medium text-black">
        {product.name}
      </td>

      <td className="min-w-[135px] px-3 text-[14px] text-[#555]">
        {product.sku}
      </td>

      <td className="min-w-[130px] px-3 text-[14px] text-black">
        {product.category}
      </td>

      <td className="min-w-[100px] px-3 text-right text-[14px] text-black">
        {formatPrice(product.price)}
      </td>

      <td className="min-w-[135px] px-3 text-center">
        <StockBadge stock={product.stock} reorderLevel={product.reorderLevel} />
      </td>

      <td className="w-[100px] px-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Actions for ${product.name}`}
              className="h-8 w-8 text-[#444]"
            >
              <MoreHorizontal size={18} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/products/${product.id}`}>
                <Eye size={14} />
                View Details
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to={`/products/${product.id}/edit`}>
                <Pencil size={14} />
                Edit Product
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
