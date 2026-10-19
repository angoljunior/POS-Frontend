
import api from "./axios";
import ENDPOINTS from "./endpoints";

// Fetch all pages from a DRF paginated endpoint.
async function fetchAllPages(endpoint) {
  const records = [];
  let next = endpoint;

  while (next) {
    const response = await api.get(next);
    const data = response.data;

    if (Array.isArray(data)) {
      records.push(...data);
      break;
    }

    records.push(...(data.results ?? []));
    next = data.next ?? null;
  }

  return records;
}

export const barcodeCatalogApi = {
  getCatalog: async () => {
    const [products, inventory, categories] =
      await Promise.all([
        fetchAllPages(ENDPOINTS.PRODUCTS),
        fetchAllPages(ENDPOINTS.INVENTORY),
        fetchAllPages(ENDPOINTS.CATEGORIES),
      ]);

    // Create a lookup of categories by ID.
    const categoryMap = new Map(
      categories.map((category) => [
        Number(category.id),
        category.name,
      ])
    );

    // Create a lookup of inventory by product ID.
    const inventoryMap = new Map(
      inventory.map((record) => [
        Number(record.product),
        record,
      ])
    );

    // Convert Django records to the format used by
    // the existing Barcode Management components.
    const catalog = products
      .filter((product) => product.is_active !== false)
      .map((product) => {
        const stockRecord = inventoryMap.get(
          Number(product.id)
        );

        const hasInventory = Boolean(stockRecord);

        return {
          id: product.id,
          sku: product.sku,
          barcode: product.barcode || product.sku,
          name: product.name,
          price: Number(product.selling_price),
          costPrice: Number(product.cost_price),

          category:
            categoryMap.get(Number(product.category)) ||
            "Uncategorised",

          categoryId: product.category,

          // Preserve missing inventory as unknown rather
          // than incorrectly treating it as zero stock.
          stock: hasInventory
            ? Number(stockRecord.quantity)
            : null,

          hasInventory,
          location: "",
          batch: "",
          image: product.image || null,
        };
      });

    return {
      products: catalog,
      categories: [...new Set(
        catalog.map((product) => product.category)
      )].sort(),
    };
  },
};
