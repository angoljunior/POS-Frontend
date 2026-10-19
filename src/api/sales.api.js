import api from "./axios";
import ENDPOINTS from "./endpoints";
import { createCrudService } from "./crud";

const sales = createCrudService(ENDPOINTS.SALES);

export const salesApi = {
  getAll: sales.getAll,
  getById: sales.getById,

  getSales: (params = {}) => sales.getAll(params),

  checkout: async (checkoutData) => {
    if (!checkoutData.idempotency_key) {
      throw new Error(
        "An idempotency_key is required for checkout."
      );
    }

    const response = await api.post(
      `${ENDPOINTS.SALES}checkout/`,
      checkoutData
    );

    return response.data;
  },
};