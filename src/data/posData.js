
export const categories = [
  { id: "all", name: "All Items", icon: null },
  { id: "beverages", name: "Beverages", icon: "coffee" },
  { id: "food", name: "Food", icon: "sandwich" },
  { id: "apparel", name: "Apparel", icon: "shirt" },
  { id: "electronics", name: "Electronics", icon: "monitor" },
];

export const products = [
  {
    id: 1,
    name: "Artisan Espresso",
    sku: "ESP-001",
    price: 4.5,
    stock: 99,
    category: "beverages",
    icon: "coffee",
  },
  {
    id: 2,
    name: "Classic Burger",
    sku: "BRG-001",
    price: 12,
    stock: 45,
    category: "food",
    icon: "sandwich",
  },
  {
    id: 3,
    name: "Logo T-Shirt (M)",
    sku: "TSH-M-BLK",
    price: 25,
    stock: 12,
    category: "apparel",
    icon: "shirt",
  },
  {
    id: 4,
    name: "Wireless Monitor",
    sku: "MON-001",
    price: 35.99,
    stock: 5,
    category: "electronics",
    icon: "monitor",
  },
];

export const TAX_RATE = 0;

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GHS",
  }).format(amount);
