import ENDPOINTS from "./endpoints";
import { createCrudService } from "./crud";

const employees = createCrudService(ENDPOINTS.EMPLOYEES);

export const employeesApi = {
  getAll: employees.getAll,
  getById: employees.getById,

  getEmployees: (params = {}) =>
    employees.getAll(params),

  getEmployeeDetails: (id) =>
    employees.getById(id),
};