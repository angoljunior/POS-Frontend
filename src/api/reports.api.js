import api from "./axios";
import ENDPOINTS from "./endpoints";

export const reportsApi = {
  getSalesReport: async (params = {}) => {
    const response = await api.get(
      ENDPOINTS.REPORTS.SALES,
      { params }
    );

    return response.data;
  },
};