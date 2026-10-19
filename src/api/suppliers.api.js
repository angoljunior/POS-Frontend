import ENDPOINTS from "./endpoints";
import { createCrudService } from "./crud";

const purchases = createCrudService(ENDPOINTS.PURCHASES);
const purchaseItems = createCrudService(
  ENDPOINTS.PURCHASE_ITEMS
);

export const purchasesApi = {
  ...purchases,

  getPurchases: (params = {}) =>
    purchases.getAll(params),

  getPurchaseDetails: (id) =>
    purchases.getById(id),

  createPurchase: (data) =>
    purchases.create(data),

  updatePurchase: (id, data) =>
    purchases.update(id, data),

  deletePurchase: (id) =>
    purchases.remove(id),
};

export const purchaseItemsApi = {
  ...purchaseItems,
};