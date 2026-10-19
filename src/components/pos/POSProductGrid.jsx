import { Plus } from "lucide-react";
import POSProductCard from "./POSProductCard";

export default function POSProductGrid({
  products,
  selectedCategory,
  onAddProduct,
}) {
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => String(product.categoryId) === selectedCategory);

  return (
    <div className="flex-1 overflow-y-auto bg-white px-[11px] py-[17px]">
      <div className="grid grid-cols-3 gap-x-[17px] gap-y-[20px] sm:grid-cols-4 xl:grid-cols-5">
        {filteredProducts.map((product) => (
          <POSProductCard
            key={product.id}
            product={product}
            onAdd={onAddProduct}
          />
        ))}

        {/* Reference design's empty add-product tile */}
        <div className="flex aspect-square items-center justify-center bg-[#fafafa]">
          <Plus size={16} className="text-[#aaa]" />
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No products found in this category.
        </p>
      )}
    </div>
  );
}
