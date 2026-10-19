const ENDPOINTS = {
  DASHBOARD: {
    SUMMARY: "/dashboard/summary/",
  },

  PRODUCTS: "/products/",
  CATEGORIES: "/categories/",
  BRANDS: "/brands/",
  PRODUCT_VARIANTS: "/product-variants/",

  INVENTORY: "/inventory/",
  STOCK_MOVEMENTS: "/stock-movements/",
  INVENTORY_BATCHES: "/inventory-batches/",

  SALES: "/sales/",
  PAYMENTS: "/payments/",

  CUSTOMERS: "/customers/",
  SUPPLIERS: "/suppliers/",

  PURCHASES: "/purchases/",
  PURCHASE_ITEMS: "/purchase-items/",

  EMPLOYEES: "/employees/",
  RECEIPTS: "/receipts/",

  REPORTS: {
    SALES: "/reports/sales/",
  },

  BARCODES: {
    PRODUCT: (productId) =>
      `/barcodes/products/${productId}/`,
  },
};

export default ENDPOINTS;