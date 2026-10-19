
import api from "./axios";

export const productsApi = {
  getAll: async (params = {}) => {
    const response = await api.get("products/", {
      params,
    });

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`products/${id}/`);
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post("products/", payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.patch(
      `products/${id}/`,
      payload
    );
    return response.data;
  },

  remove: async (id) => {
    await api.delete(`products/${id}/`);
  },
};
