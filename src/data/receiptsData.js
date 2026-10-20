export const receiptMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GHS", currencyDisplay: "code",
  }).format(Number(value ?? 0));

export const receiptDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Accra",
  }).format(new Date(value));

export const receiptTime = (value) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Africa/Accra",
  }).format(new Date(value));

export function calculateReceiptTotals(receipt) {
  const subtotal = Number(receipt.subtotal);
  const discount = Number(receipt.discount);
  return { subtotal, discount, taxable: subtotal - discount, tax: Number(receipt.tax), total: Number(receipt.total) };
}
