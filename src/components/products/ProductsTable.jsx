import { Checkbox } from "@/components/ui/checkbox";
import ProductRow from "./ProductRow";

export default function ProductsTable({
  products,
  selectedIds,
  setSelectedIds,
}) {
  const allSelected =
    products.length > 0 &&
    products.every((product) => selectedIds.includes(product.id));

  const someSelected = products.some((product) =>
    selectedIds.includes(product.id),
  );

  function toggleAll(checked) {
    const visibleIds = products.map((product) => product.id);

    if (checked === true) {
      setSelectedIds((previous) => [...new Set([...previous, ...visibleIds])]);
    } else {
      setSelectedIds((previous) =>
        previous.filter((id) => !visibleIds.includes(id)),
      );
    }
  }

  function toggleOne(id, checked) {
    setSelectedIds((previous) =>
      checked
        ? [...new Set([...previous, id])]
        : previous.filter((value) => value !== id),
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[950px] border-collapse text-left">
        <thead>
          <tr className="h-[52px] border-b border-[#d4cccc] bg-[#e9e9e9] text-[13px] font-semibold tracking-wide text-[#222]">
            <th className="w-[50px] px-[17px]">
              <Checkbox
                checked={
                  allSelected ? true : someSelected ? "indeterminate" : false
                }
                onCheckedChange={toggleAll}
                aria-label="Select all visible products"
                className="rounded-[2px] border-[#d5caca] bg-white"
              />
            </th>
            <th className="w-[80px] px-2">IMAGE</th>
            <th className="px-3">PRODUCT NAME</th>
            <th className="px-3">SKU</th>
            <th className="px-3">CATEGORY</th>
            <th className="px-3 text-right">PRICE</th>
            <th className="px-3 text-center">STOCK</th>
            <th className="px-3 text-right">ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-14 text-center text-sm text-[#666]">
                No products match your filters.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                selected={selectedIds.includes(product.id)}
                onSelect={toggleOne}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
