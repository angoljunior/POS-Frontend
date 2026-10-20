import api from "./axios.js";
import { saleDay } from "./salesHistory.api.js";

export async function loadDashboard(signal) {
  const { data } = await api.get("dashboard/summary/", { signal });
  return data;
}

export async function loadReceipts(signal) {
  let next = "receipts/";
  const records = [];
  while (next) {
    const { data } = await api.get(next, { signal });
    const rows = Array.isArray(data) ? data : data?.results;
    if (!Array.isArray(rows)) throw new Error("Unexpected receipts response from the server.");
    records.push(...rows);
    next = Array.isArray(data) ? null : data.next;
  }
  return records.map((row) => {
    const sale = row.sale_details;
    if (!sale) throw new Error("Receipt details are unavailable. Update the Django backend and retry.");
    const items = (sale.items || []).map((item) => ({ name: item.product_name, sku: item.product_sku, quantity: Number(item.quantity), price: Number(item.unit_price), subtotal: Number(item.subtotal) }));
    return { id: row.id, receiptNo: row.receipt_number, orderNo: String(row.sale), date: row.issued_at,
      paymentReference: sale.payment_reference || sale.payments?.[0]?.reference || "", cashier: sale.cashier_name, customer: sale.customer_name, customerId: sale.customer,
      items, itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
      paymentMethods: sale.payment_methods || [], payment: (sale.payment_methods || []).join(", ") || "Not recorded",
      status: sale.status.charAt(0) + sale.status.slice(1).toLowerCase(),
      subtotal: Number(sale.subtotal), discount: Number(sale.discount), tax: Number(sale.tax), total: Number(sale.total) };
  });
}

export function receiptMatchesDate(value, filter, now = new Date()) {
  const day = saleDay(value);
  const today = saleDay(now);
  const age = (Date.parse(today) - Date.parse(day)) / 86400000;
  return filter === "all" || (filter === "today" && day === today) || (filter === "week" && age >= 0 && age < 7);
}
