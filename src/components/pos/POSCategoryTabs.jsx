import { Coffee, Sandwich, Shirt, MonitorSmartphone } from "lucide-react";

const categoryIcons = {
  coffee: Coffee,
  sandwich: Sandwich,
  shirt: Shirt,
  monitor: MonitorSmartphone,
};

export default function POSCategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
}) {
  return (
    <div className="flex h-[48px] items-center gap-[6px] overflow-x-auto border-b border-[#dedede] bg-[#f2f2f2] px-[6px]">
      {categories.map((category) => {
        const Icon = categoryIcons[category.icon];
        const active = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={`flex h-[25px] shrink-0 items-center justify-center gap-[5px] border px-[11px] text-[10px] font-semibold transition-colors ${
              active
                ? "border-black bg-black text-white"
                : "border-transparent bg-white text-black hover:bg-[#e5e5e5]"
            }`}
          >
            {Icon && <Icon size={12} strokeWidth={1.8} />}
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
