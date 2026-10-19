import api from "./axios.js";

async function fetchAll(endpoint, signal) {
  const records = [];
  let next = endpoint;
  while (next) {
    const { data } = await api.get(next, { signal });
    if (Array.isArray(data)) return [...records, ...data];
    if (!Array.isArray(data?.results)) {
      throw new Error(`Unexpected response while loading ${endpoint}`);
    }
    records.push(...data.results);
    next = data.next;
  }
  return records;
}

const relatedId = (value) => value && typeof value === "object" ? value.id : value;

export async function loadInventory(signal) {
  const [inventory, products, categories] = await Promise.all([
    fetchAll("inventory/", signal),
    fetchAll("products/", signal),
    fetchAll("categories/", signal),
  ]);
  const productMap = new Map(products.map((item) => [String(item.id), item]));
  const categoryMap = new Map(categories.map((item) => [String(item.id), item.name]));
  return inventory.map((record) => {
    const productId = relatedId(record.product);
    const product = productMap.get(String(productId));
    if (!product) throw new Error(`Product details are missing for inventory record ${record.id}.`);
    return {
      id: record.id,
      productId,
      name: product.name,
      sku: product.sku,
      category: categoryMap.get(String(relatedId(product.category))) || "Uncategorised",
      onHand: Number(record.quantity),
      reserved: null, // The backend does not track reservations.
      reorderLevel: Number(product.reorder_level),
    };
  });
}

export const loadCustomers = (signal) => fetchAll("customers/", signal);

export async function saveCustomer(id, fields) {
  const { data } = id == null
    ? await api.post("customers/", fields)
    : await api.patch(`customers/${id}/`, fields);
  return data;
}

export function requestError(error, fallback) {
  if (!error.response) return error.message === "Network Error"
    ? "Cannot reach the server. Check your connection and that Django is running."
    : error.message || fallback;
  const data = error.response.data;
  if (typeof data?.detail === "string") return data.detail;
  if (data && typeof data === "object") {
    const messages = Object.entries(data).map(([field, value]) =>
      `${field === "non_field_errors" ? "" : `${field}: `}${Array.isArray(value) ? value.join(" ") : String(value)}`
    );
    if (messages.length) return messages.join(" ");
  }
  return fallback;
}


export async function updateInventoryQuantity(id, quantity, expectedQuantity, notes) {
  const { data } = await api.patch(`inventory/${id}/`, {
    quantity, expected_quantity: expectedQuantity, notes,
  });
  return data;
}
