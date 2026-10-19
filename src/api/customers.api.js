import ENDPOINTS from "./endpoints";
import { createCrudService } from "./crud";

const customers = createCrudService(ENDPOINTS.CUSTOMERS);

export const customersApi = {
  ...customers,

  search: (search) => customers.getAll({ search }),

  getCustomers: (params = {}) => customers.getAll(params),

  createCustomer: (data) => customers.create(data),

  updateCustomer: (id, data) =>
    customers.update(id, data),

  deleteCustomer: (id) => customers.remove(id),
};