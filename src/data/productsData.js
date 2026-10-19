
export const sampleProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    sku: "HW-WH-001",
    category: "Electronics",
    brand: "SoundMax",
    price: 299.99,
    stock: 45,
    image: "",
  },
  {
    id: 2,
    name: "Basic Cotton T-Shirt - M - White",
    sku: "AP-TS-WM-02",
    category: "Apparel",
    brand: "UrbanWear",
    price: 19.50,
    stock: 4,
    image: "",
  },
  {
    id: 3,
    name: "Ceramic Coffee Mug",
    sku: "HG-CM-001",
    category: "Home Goods",
    brand: "HomeStyle",
    price: 12.00,
    stock: 120,
    image: "",
  },
];

export const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
