import api from "./axios";

export const createCrudService = (endpoint) => ({
  // GET all records
  getAll: async (params = {}) => {
    const response = await api.get(endpoint, { params });
    return response.data;
  },

  // GET a record by ID
  getById: async (id) => {
    const response = await api.get(`${endpoint}${id}/`);
    return response.data;
  },

  // POST a new record
  create: async (data) => {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  // PATCH existing record
  update: async (id, data) => {
    const response = await api.patch(
      `${endpoint}${id}/`,
      data
    );
    return response.data;
  },

  // PUT replace a record
  replace: async (id, data) => {
    const response = await api.put(
      `${endpoint}${id}/`,
      data
    );
    return response.data;
  },

  // DELETE a record
  remove: async (id) => {
    const response = await api.delete(
      `${endpoint}${id}/`
    );
    return response.data;
  },
});