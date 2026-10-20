import Barcode from "react-barcode";
import {
  receiptMoney,
  receiptTime,
  receiptDate,
  calculateReceiptTotals,
} from "@/data/receiptsData";

export default function ReceiptPaper({ receipt, settings }) {
  if (!receipt) return null;

  const totals = calculateReceiptTotals(receipt);

  const details = [
    ["RECEIPT #:", receipt.receiptNo],
    ["TRANS ID:", `#${receipt.orderNo}`],
    ["PAYMENT REF:", receipt.paymentReference],
    ["DATE:", `${receiptDate(receipt.date)} ${receiptTime(receipt.date)}`],
    ["CASHIER:", receipt.cashier],
    [
      "CUSTOMER:",
      `${receipt.customer}${
        receipt.customerId ? ` (#${receipt.customerId})` : ""
      }`,
    ],
  ];

  return (
    <div className="thermal-paper mx-auto w-[320px] max-w-full bg-white px-[17px] py-[22px] font-sans text-black">
      {/* Logo */}
      <div className="text-center">
        <div className="mx-auto flex h-[36px] w-[36px] items-center justify-center bg-black text-[15px] font-bold text-white">
          NX
        </div>

        <h2 className="mt-[8px] text-[12px] font-extrabold">
          {settings.storeName}
        </h2>

        <p className="mt-1 whitespace-pre-line text-[9px] leading-[12px] text-[#666]">
          {settings.address}
        </p>

        {settings.phone && <p className="text-[9px] text-[#666]">Tel: {settings.phone}</p>}

        {settings.taxId && <p className="text-[9px] text-[#666]">Tax ID: {settings.taxId}</p>}
      </div>

      <div className="my-[13px] border-t border-dashed border-[#999]" />

      {/* Transaction details */}
      <div className="space-y-[4px]">
        {details.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-2 text-[9px]">
            <span
              className={`shrink-0 ${
                label === "RECEIPT #:" || label === "CUSTOMER:"
                  ? "font-bold"
                  : "text-[#666]"
              }`}
            >
              {label}
            </span>
            <span className="min-w-0 break-all text-right font-medium">{value}</span>
          </div>
        ))}
      </div>

      <div className="my-[12px] border-t border-dashed border-[#999]" />

      {/* Items */}
      <div>
        <div className="mb-[8px] flex justify-between text-[9px] font-bold">
          <span>ITEM DESCRIPTION</span>
          <span>TOTAL</span>
        </div>

        <div className="space-y-[10px]">
          {receipt.items.map((item, index) => (
            <div key={`${item.sku}-${index}`}>
              <div className="flex justify-between gap-2 text-[9px] font-semibold">
                <span className="min-w-0">{item.name}</span>
                <span className="shrink-0">
                  {receiptMoney(item.subtotal)}
                </span>
              </div>

              <div className="mt-[3px] flex justify-between gap-1 text-[8px] text-[#777]">
                <span>
                  {item.quantity} qty @ {receiptMoney(item.price)} ea
                </span>
                <span>SKU: {item.sku}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="my-[12px] border-t border-dashed border-[#999]" />

      {/* Totals */}
      <div className="space-y-[4px]">
        <div className="flex justify-between text-[9px]">
          <span>Subtotal</span>
          <span>{receiptMoney(totals.subtotal)}</span>
        </div>

        {totals.discount !== 0 && (
          <div className="flex justify-between text-[9px]">
            <span>
              Discount
            </span>
            <span>-{receiptMoney(totals.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-[9px]">
          <span>Subtotal after discount</span>
          <span>{receiptMoney(totals.taxable)}</span>
        </div>

        {totals.tax !== 0 && (
          <div className="flex justify-between text-[9px]">
            <span>Tax</span>
            <span>{receiptMoney(totals.tax)}</span>
          </div>
        )}
      </div>

      <div className="my-[10px] border-t-2 border-black" />

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold">
          {receipt.status === "Refunded" ? "REFUND TOTAL" : "GRAND TOTAL"}
        </span>
        <span className="text-[17px] font-extrabold">
          {receiptMoney(receipt.total)}
        </span>
      </div>

      <div className="my-[10px] border-t border-dashed border-[#999]" />

      {/* Payment information */}
      <div className="flex justify-between gap-2 text-[9px] font-bold">
        <span>
          METHOD: {receipt.paymentDetail || receipt.payment.toUpperCase()}
        </span>
        {receipt.paymentLast4 && <span>**** {receipt.paymentLast4}</span>}
      </div>

      <p className="mt-1 text-[8px] text-[#777]">
        Sale status: {receipt.status}
      </p>

      {/* Barcode */}
      {settings.showBarcode && (
        <div className="mt-[17px] flex flex-col items-center overflow-hidden">
          <div className="max-w-full overflow-hidden">
            <Barcode
              value={receipt.receiptNo}
              format="CODE128"
              width={0.6}
              height={35}
              margin={0}
              displayValue={false}
            />
          </div>

          <p className="mt-2 font-mono text-[8px] font-semibold tracking-wider">
            {receipt.receiptNo}
          </p>
        </div>
      )}

      {settings.showLoyalty && receipt.customerId && (
        <div className="mt-[15px] border border-[#aaa] bg-[#f3f3f3] p-2">
          <p className="text-[9px] font-bold">DIGITAL RECEIPT &amp; POINTS</p>
          <p className="mt-1 text-[8px] text-[#666]">
            Scan your receipt and keep your loyalty account updated.
          </p>
        </div>
      )}

      <div className="mt-[14px] border-t border-dashed border-[#aaa] pt-[12px] text-center">
        <p className="text-[9px] font-bold">{settings.footerText}</p>

        <p className="mt-1 text-[8px] text-[#777]">
          Retain this receipt for your records.
        </p>

        <p className="mt-1 text-[8px] text-[#777]">
          Original receipt date: {receiptDate(receipt.date)}
        </p>
      </div>
    </div>
  );
}
