import { useMemo, useState } from "react";

import InventoryHeader from "@/components/inventory/InventoryHeader";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventoryTable from "@/components/inventory/InventoryTable";
import InventoryPagination from "@/components/inventory/InventoryPagination";
import { Button } from "@/components/ui/button";
import { loadInventory, updateInventoryQuantity } from "@/api/directories.api";
import { useRemoteData } from "@/hooks/useRemoteData";

import {
  getAvailableStock,
  getInventoryStatus,
} from "@/data/inventoryData";

import { useAuth } from "@/context/AuthContext";
import StockAdjustmentDialog from "@/components/inventory/StockAdjustmentDialog";

const PAGE_SIZE = 5;

export default function Inventory() {
  const { data, setData, loading, error, reload } = useRemoteData(loadInventory);
  const inventory = useMemo(() => data || [], [data]);
  const [stockStatus, setStockStatus] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);
  const { hasPermission } = useAuth();

  async function saveQuantity(id, quantity, expected, notes) {
    const saved = await updateInventoryQuantity(id, quantity, expected, notes);
    setData((current) => current.map((item) => item.id === saved.id
      ? { ...item, onHand: Number(saved.quantity) } : item));
  }

  const filteredInventory = useMemo(() => {
    return inventory.filter(
      (item) =>
        stockStatus === "all" || getInventoryStatus(item) === stockStatus,
    );
  }, [inventory, stockStatus]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInventory.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const currentItems = filteredInventory.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function changeStockStatus(value) {
    setStockStatus(value);
    setPage(1);
    setSelectedIds([]);
  }

  function handleExport() {
    const headers = [
      "Product",
      "SKU",
      "Category",
      "On Hand",
      "Reserved",
      "Available",
      "Status",
    ];

    const rows = filteredInventory.map((item) => [
      item.name,
      item.sku,
      item.category,
      item.onHand,
      item.reserved,
      getAvailableStock(item),
      getInventoryStatus(item),
    ]);

    const escapeCsv = (value) => {
      const text = String(value ?? "");
      const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;

      return `"${safe.replace(/"/g, '""')}"`;
    };

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "nexapos-inventory.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-full bg-[#fafafa] px-[14px] py-[8px]">
      <div className="mx-auto max-w-[1600px] space-y-[25px]">
        <InventoryHeader onStockAdjustment={!loading && !error && hasPermission("inventory.adjust") ? () => setAdjustmentOpen(true) : undefined} />
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[#666]">Reserved stock is not tracked.</p>
          <Button variant="outline" onClick={() => { setSelectedIds([]); reload(); }} disabled={loading || adjustmentOpen}>
            {loading ? "Loading..." : error ? "Retry" : "Refresh"}
          </Button>
        </div>
        {loading && <p role="status">Loading inventory...</p>}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {!loading && !error && <>

        <InventoryFilters
          stockStatus={stockStatus}
          onStockStatusChange={changeStockStatus}
          onExport={handleExport}
          onPrint={() => window.print()}
        />

        <div className="border border-[#d8cece] bg-white">
          <InventoryTable
            inventory={currentItems}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />

          {/* Empty space visible beneath the rows in the reference */}
          <div className="hidden h-[98px] bg-white lg:block" />

          <InventoryPagination
            page={currentPage}
            setPage={setPage}
            totalItems={filteredInventory.length}
            pageSize={PAGE_SIZE}
          />
        </div>
        </> }
      </div>
      {adjustmentOpen && <StockAdjustmentDialog
        open={adjustmentOpen} onOpenChange={setAdjustmentOpen}
        inventory={inventory} onSave={saveQuantity}
      />}
    </div>
  );
}
