import ENDPOINTS from "./endpoints";
import { createCrudService } from "./crud";

const inventory = createCrudService(ENDPOINTS.INVENTORY);
const movements = createCrudService(
  ENDPOINTS.STOCK_MOVEMENTS
);
const batches = createCrudService(
  ENDPOINTS.INVENTORY_BATCHES
);

export const inventoryApi = {
  getAll: inventory.getAll,
  getById: inventory.getById,

  getMovements: movements.getAll,
  getMovementById: movements.getById,

  getBatches: batches.getAll,
  getBatchById: batches.getById,

  getLowStock: async () => {
    const allItems = [];
    let next = ENDPOINTS.INVENTORY;

    // Uses the existing inventory list API.
    // Fetch each page so low-stock results are complete.
    const { default: api } = await import("./axios");

    while (next) {
      const response = await api.get(next);
      const data = response.data;

      const records = Array.isArray(data)
        ? data
        : data.results || [];

      allItems.push(...records);

      next = Array.isArray(data) ? null : data.next;
    }

    const lowStockItems = allItems.filter((item) => {
      const threshold = item.product_details?.reorder_level;

      return (
        threshold !== undefined &&
        Number(item.quantity) <= Number(threshold)
      );
    });

    return lowStockItems;
  },
};