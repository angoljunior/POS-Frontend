
import api from "./axios.js";

// Retrieve all pages from a DRF endpoint.
// Works with both paginated and non-paginated responses.
async function fetchAll(endpoint) {
  let next = endpoint;
  const results = [];

  while (next) {
    const response = await api.get(next);
    const payload = response.data;

    if (Array.isArray(payload)) {
      results.push(...payload);
      break;
    }

    if (!Array.isArray(payload.results)) {
      throw new Error(`Unexpected response from ${endpoint}`);
    }

    results.push(...payload.results);
    next = payload.next;
  }

  return results;
}

function getRelatedId(value) {
  if (value && typeof value === "object") {
    return value.id;
  }

  return value;
}

function getProductIdFromInventory(record) {
  return getRelatedId(record.product);
}

export const productsCatalogApi = {
  getAll: async () => {
    const [products, categories, brands, inventory] =
      await Promise.all([
        fetchAll("products/"),
        fetchAll("categories/"),
        fetchAll("brands/"),
        fetchAll("inventory/"),
      ]);

    const categoryMap = new Map(
      categories.map((item) => [
        String(item.id),
        item.name,
      ])
    );

    const brandMap = new Map(
      brands.map((item) => [
        String(item.id),
        item.name,
      ])
    );

    const inventoryMap = new Map(
      inventory.map((record) => [
        String(getProductIdFromInventory(record)),
        record,
      ])
    );

    const catalog = products.map((product) => {
      const categoryId = getRelatedId(product.category);
      const brandId = getRelatedId(product.brand);

      const stockRecord = inventoryMap.get(
        String(product.id)
      );

      const stock =
        stockRecord &&
        stockRecord.quantity !== null &&
        stockRecord.quantity !== undefined
          ? Number(stockRecord.quantity)
          : null;

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        barcode: product.barcode || "",
        description: product.description || "",

        categoryId,
        category:
          categoryMap.get(String(categoryId)) ||
          product.category_name ||
          "Uncategorised",

        brandId,
        brand:
          brandMap.get(String(brandId)) ||
          product.brand_name ||
          "Unbranded",

        price: Number(product.selling_price ?? 0),
        costPrice: Number(product.cost_price ?? 0),

        stock,
        reorderLevel: Number(product.reorder_level ?? 5),

        isActive: product.is_active !== false,
        image: product.image || null,
      };
    });

    return {
      products: catalog,
      categories: categories.map((item) => ({
        value: String(item.id),
        label: item.name,
      })),
      brands: brands.map((item) => ({
        value: String(item.id),
        label: item.name,
      })),
    };
  },
};
