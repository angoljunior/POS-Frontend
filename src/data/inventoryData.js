
export const sampleInventory = [
  {
    id: 1,
    name: "Premium Whole Bean Coffee",
    sku: "BEAN-001-DARK",
    category: "Beverages",
    onHand: 245,
    reserved: 15,
    reorderLevel: 10,
  },
  {
    id: 2,
    name: "Espresso Machine Filters (50pk)",
    sku: "EQ-FILT-050",
    category: "Equipment",
    onHand: 12,
    reserved: 8,
    reorderLevel: 10,
  },
  {
    id: 3,
    name: "Organic Oat Milk (1L)",
    sku: "DAIRY-OAT-1L",
    category: "Dairy Alternatives",
    onHand: 180,
    reserved: 0,
    reorderLevel: 15,
  },
  {
    id: 4,
    name: "Artisan Sourdough Loaf",
    sku: "BAK-SD-01",
    category: "Bakery",
    onHand: 2,
    reserved: 2,
    reorderLevel: 5,
  },
  {
    id: 5,
    name: "Ceramic Coffee Mug (8oz)",
    sku: "MERCH-MUG-WHT",
    category: "Merchandise",
    onHand: 45,
    reserved: 5,
    reorderLevel: 10,
  },
];

export function getAvailableStock(item) {
  return Math.max(0, item.onHand - item.reserved);
}

export function getInventoryStatus(item) {
  const available = getAvailableStock(item);

  if (available === 0) return "out";
  if (available <= item.reorderLevel) return "low";

  return "in";
}
