import ENDPOINTS from "./endpoints";
import { createCrudService } from "./crud";

const payments = createCrudService(ENDPOINTS.PAYMENTS);

export const paymentsApi = {
  getAll: payments.getAll,
  getById: payments.getById,

  getPayments: (params = {}) => payments.getAll(params),
};