import { Badge } from "@/components/ui/badge";

export default function StockBadge({ stock, reorderLevel = 5 }) {
  const base =
    "rounded-none border px-2 py-1 text-[12px] font-medium shadow-none";

  if (stock === null || stock === undefined) {
    return (
      <Badge
        variant="outline"
        className={`${base} border-gray-300 bg-gray-100 text-gray-600`}
      >
        Unknown Stock
      </Badge>
    );
  }

  if (stock <= 0) {
    return (
      <Badge
        variant="outline"
        className={`${base} border-red-200 bg-red-50 text-red-600`}
      >
        Out of Stock
      </Badge>
    );
  }

  if (stock <= reorderLevel) {
    return (
      <Badge
        variant="outline"
        className={`${base} border-amber-200 bg-amber-50 text-amber-700`}
      >
        Low Stock
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`${base} border-gray-300 bg-gray-100 text-gray-700`}
    >
      In Stock
    </Badge>
  );
}
