import api from "./axios.js";

export const checkoutApi = {
  cancelTestPayment: async (id) => (await api.post(`checkout/payments/${id}/cancel-test/`)).data,
  quote: async (items, discount_percent = 0) => (await api.post("checkout/quote/", { items, discount_percent })).data,
  submit: async (payload) => (await api.post("sales/checkout/", payload)).data,
  byKey: async (key) => (await api.get(`checkout/by-key/${key}/`)).data,
  status: async (id, verify = false) => (await api[verify ? "post" : "get"](`checkout/payments/${id}/`)).data,
  customers: async (search, signal) => {
    const { data } = await api.get("customers/", { params: { search }, signal });
    return Array.isArray(data) ? data : data.results;
  },
  confirmTransfer: async (id, settlement_reference) => (await api.post(`checkout/payments/${id}/confirm-transfer/`, { settlement_reference })).data,
  cancelTransfer: async (id) => (await api.post(`checkout/payments/${id}/cancel-transfer/`)).data,
  refund: async (payload) => (await api.post("checkout/refunds/", payload)).data,
  confirmRefund: async (id, settlement_reference) => (await api.post(`checkout/refunds/${id}/confirm/`, { settlement_reference })).data,
  reconcileRefund: async (id) => (await api.post(`checkout/refunds/${id}/reconcile/`)).data,
  queue: async () => (await api.get("checkout/reconciliation/")).data,
};

export function checkoutCompleted(sale) {
  return sale?.status === "COMPLETED" && Boolean(sale.receipt_id) && sale.payments?.some((payment) => payment.status === "SUCCESS" || payment.status === "REFUNDED");
}

export function notifyPOSDataChanged() {
  window.dispatchEvent(new Event("pos-data-changed"));
  localStorage.setItem("pos-data-changed", String(Date.now()));
}
