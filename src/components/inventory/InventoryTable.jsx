import { Checkbox } from "@/components/ui/checkbox";
import InventoryRow from "./InventoryRow";

export default function InventoryTable({
  inventory,
  selectedIds,
  setSelectedIds,
}) {
  const visibleIds = inventory.map((item) => item.id);

  const allSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const someSelected = visibleIds.some((id) => selectedIds.includes(id));

  function toggleAll(checked) {
    setSelectedIds((current) => {
      if (checked === true) {
        return [...new Set([...current, ...visibleIds])];
      }

      return current.filter((id) => !visibleIds.includes(id));
    });
  }

  function toggleOne(id, checked) {
    setSelectedIds((current) =>
      checked
        ? [...new Set([...current, id])]
        : current.filter((value) => value !== id),
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[930px] border-collapse text-left">
        <thead>
          <tr className="h-[44px] border-b border-[#d5cdcd] bg-[#e9e9e9] text-[13px] font-semibold tracking-wide text-[#333]">
            <th className="w-[60px] px-[18px]">
              <Checkbox
                checked={
                  allSelected ? true : someSelected ? "indeterminate" : false
                }
                onCheckedChange={toggleAll}
                aria-label="Select all visible inventory items"
                className="rounded-[2px] border-[#d0c7c7] bg-white"
              />
            </th>
            <th className="px-4">Product &amp; SKU</th>
            <th className="px-3">Category</th>
            <th className="px-3 text-right">On Hand</th>
            <th className="px-3 text-right">Reserved</th>
            <th className="px-3 text-right">Available</th>
            <th className="px-3 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {inventory.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-14 text-center text-sm text-[#666]">
                No inventory records match the selected filter.
              </td>
            </tr>
          ) : (
            inventory.map((item) => (
              <InventoryRow
                key={item.id}
                item={item}
                selected={selectedIds.includes(item.id)}
                onSelect={toggleOne}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
