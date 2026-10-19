import api from "./axios";
import ENDPOINTS from "./endpoints";

export const dashboardApi = {
  getSummary: async () => {
    const response = await api.get(
      ENDPOINTS.DASHBOARD.SUMMARY
    );

    return response.data;
  },
};