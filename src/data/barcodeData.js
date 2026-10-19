
export const catalog = [
  {
    id: 1,
    sku: "HW-WH-001",
    name: "Premium Wireless Headphones",
    price: 299.99,
    stock: 24,
    category: "Audio & Electronics",
    location: "A-12-4",
    batch: "2408A",
  },
  {
    id: 2,
    sku: "CB-USBC-02",
    name: "Braided USB-C Cable 2m",
    price: 19.99,
    stock: 118,
    category: "Audio & Electronics",
    location: "B-04-1",
    batch: "2407C",
  },
  {
    id: 3,
    sku: "AUD-MIC-PRO",
    name: "Studio Broadcast Mic",
    price: 149.0,
    stock: 10,
    category: "Audio & Electronics",
    location: "C-01-9",
    batch: "2405B",
  },
];

export const initialBatch = [
  { ...catalog[0], printQty: 24 },
  { ...catalog[1], printQty: 50 },
  { ...catalog[2], printQty: 10 },
];

export const initialElements = {
  productName: true,
  price: true,
  sku: true,
  storeName: true,
  readableSku: true,
  batch: false,
};

export const LABELS_PER_SHEET = 6;

export const money = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
