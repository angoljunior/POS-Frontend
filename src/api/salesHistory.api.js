import api from "./axios.js";

export async function loadSales(signal) {
  let next = "sales/";
  const sales = [];
  while (next) {
    const { data } = await api.get(next, { signal });
    if (Array.isArray(data)) return [...sales, ...data];
    if (!Array.isArray(data?.results)) throw new Error("Unexpected sales response from the server.");
    sales.push(...data.results);
    next = data.next;
  }
  return sales;
}

export const saleMoney = (value) => new Intl.NumberFormat("en-GH", {
  style: "currency", currency: "GHS",
}).format(Number(value ?? 0));

export function saleDay(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Africa/Accra", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function filterSales(sales, { search = "", status = "all", from = "", to = "" }) {
  if (from && to && from > to) return [];
  const query = search.trim().toLowerCase();
  return sales.filter((sale) => {
    const day = saleDay(sale.created_at);
    const text = [sale.id, sale.customer_name, sale.cashier_name,
      ...(sale.items || []).flatMap((item) => [item.product_name, item.product_sku])].join(" ").toLowerCase();
    return (!query || text.includes(query)) && (status === "all" || sale.status === status)
      && (!from || day >= from) && (!to || day <= to);
  });
}

export function salesSummary(sales) {
  const completed = sales.filter((sale) => sale.status === "COMPLETED");
  const revenue = completed.reduce((sum, sale) => sum + Math.round(Number(sale.total) * 100), 0) / 100;
  return {
    count: sales.length, revenue, completed: completed.length,
    average: completed.length ? revenue / completed.length : 0,
    pending: sales.filter((sale) => sale.status === "PENDING").length,
  };
}

export function salesCSV(sales) {
  const rows = [["Sale ID", "Date (Accra)", "Customer", "Cashier", "Status", "Payment methods", "Quantity", "Total (GHS)"],
    ...sales.map((sale) => [sale.id, saleDay(sale.created_at), sale.customer_name, sale.cashier_name,
      sale.status, (sale.payment_methods || []).join(", "),
      (sale.items || []).reduce((sum, item) => sum + Number(item.quantity), 0), sale.total])];
  return rows.map((row) => row.map((value) => {
    const raw = String(value ?? "");
    const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
    return `"${safe.replace(/"/g, '""')}"`;
  }).join(",")).join("\r\n");
}
