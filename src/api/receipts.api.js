import ENDPOINTS from "./endpoints";
import { createCrudService } from "./crud";

const receipts = createCrudService(ENDPOINTS.RECEIPTS);

export const receiptsApi = {
  getAll: receipts.getAll,
  getById: receipts.getById,

  getReceipts: (params = {}) =>
    receipts.getAll(params),

  getReceiptDetails: (id) =>
    receipts.getById(id),
};