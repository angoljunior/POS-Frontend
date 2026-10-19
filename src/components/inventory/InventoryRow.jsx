import { AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import InventoryStatusBadge from "./InventoryStatusBadge";
import { getAvailableStock, getInventoryStatus } from "@/data/inventoryData";

export default function InventoryRow({ item, selected, onSelect }) {
  const available = getAvailableStock(item);
  const status = getInventoryStatus(item);
  const warning = status !== "in";

  return (
    <tr
      className={`h-[67px] border-b border-[#e0dada] last:border-b-0 ${
        warning ? "bg-[#fffafa]" : "bg-white"
      }`}
    >
      <td className="relative w-[60px] px-[18px]">
        {warning && (
          <span className="absolute bottom-0 right-0 top-0 w-[2px] bg-red-600" />
        )}

        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(item.id, checked === true)}
          aria-label={`Select ${item.name}`}
          className={`rounded-[2px] ${
            warning ? "border-red-500" : "border-[#d0c7c7]"
          }`}
        />
      </td>

      <td className="min-w-[300px] px-4">
        <div className="flex items-center gap-2">
          {warning && (
            <AlertTriangle size={14} className="shrink-0 text-red-600" />
          )}

          <div className="min-w-0">
            <p
              className={`text-[14px] font-medium ${
                warning ? "text-red-600" : "text-black"
              }`}
            >
              {item.name}
            </p>

            <p className="mt-[2px] text-[12px] text-[#666]">SKU: {item.sku}</p>
          </div>
        </div>
      </td>

      <td className="min-w-[150px] px-3 text-[14px] text-[#555]">
        {item.category}
      </td>

      <td className="w-[100px] px-3 text-right text-[14px] text-black">
        {item.onHand}
      </td>

      <td className="w-[105px] px-3 text-right text-[14px] text-[#555]">
        {item.reserved ?? "—"}
      </td>

      <td
        className={`w-[105px] px-3 text-right text-[14px] font-semibold ${
          warning ? "text-red-600" : "text-black"
        }`}
      >
        {available}
      </td>

      <td className="w-[185px] px-3 text-center">
        <InventoryStatusBadge status={status} />
      </td>
    </tr>
  );
}
