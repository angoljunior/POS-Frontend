import {
  Coffee,
  Sandwich,
  Shirt,
  MonitorSmartphone,
  Package,
} from "lucide-react";

import { formatCurrency } from "@/data/posData";

const productIcons = {
  coffee: Coffee,
  sandwich: Sandwich,
  shirt: Shirt,
  monitor: MonitorSmartphone,
};

export default function POSProductCard({ product, onAdd }) {
  const Icon = productIcons[product.icon] || Package;
  const outOfStock = product.stock <= 0;

  return (
    <button
      type="button"
      disabled={outOfStock}
      onClick={() => onAdd(product)}
      className="group min-w-0 text-left disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="relative flex aspect-square w-full items-center justify-center bg-[#f3f3f3] transition-colors group-hover:bg-[#eaeaea]">
        <Icon size={23} strokeWidth={1.7} className="text-[#536070]" />

        <span className="absolute right-1 top-1 flex min-h-[19px] min-w-[19px] items-center justify-center bg-black px-1 text-[11px] font-bold text-white">
          {product.stock}
        </span>
      </div>

      <div className="mt-[5px]">
        <p
          className="truncate text-[10px] font-semibold text-black"
          title={product.name}
        >
          {product.name}
        </p>

        <p className="mt-[2px] text-center text-[11px] text-[#333]">
          {formatCurrency(product.price)}
        </p>
      </div>
    </button>
  );
}
