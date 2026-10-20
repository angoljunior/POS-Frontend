import { receiptMoney, receiptDate, receiptTime } from "@/data/receiptsData";

export default function ReceiptTable({ receipts, selectedId, onSelect }) {
  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <table className="w-full min-w-[420px] border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-[#f4f4f4]">
          <tr className="h-[36px] border-b border-[#d7d0d0] text-[9px] font-bold tracking-wide text-[#666]">
            <th className="w-[30px] px-1">#</th>
            <th className="px-1">RECEIPT / ORDER</th>
            <th className="px-1">TIMESTAMP</th>
            <th className="px-1">CASHIER</th>
            <th className="px-1">CUSTOMER</th>
            <th className="px-2 text-right">TOTAL</th>
          </tr>
        </thead>

        <tbody>
          {receipts.map((receipt) => {
            const active = receipt.id === selectedId;

            return (
              <tr
                key={receipt.id}
                onClick={() => onSelect(receipt.id)}
                className={`h-[63px] cursor-pointer border-b border-[#ddd] text-[10px] hover:bg-[#f5f5f5] ${
                  active ? "bg-[#f0f0f0]" : "bg-white"
                }`}
              >
                <td className="px-1">
                  <input
                    type="radio"
                    name="selected-receipt"
                    checked={active}
                    onChange={() => onSelect(receipt.id)}
                    aria-label={`Select ${receipt.receiptNo}`}
                    className="accent-black"
                  />
                </td>

                <td className="px-1">
                  <p className="font-bold">{receipt.receiptNo}</p>
                  <p className="mt-1 text-[9px] text-[#777]">
                    {receipt.orderNo.slice(0, 8)}
                  </p>
                </td>

                <td className="px-1">
                  <p>{receiptDate(receipt.date)}</p>
                  <p className="text-[9px] text-[#777]">
                    {receiptTime(receipt.date)}
                  </p>
                </td>

                <td className="px-1">
                  <p>{receipt.cashier}</p>
                  <p className="text-[9px] text-[#777]">
                    {receipt.status}
                  </p>
                </td>

                <td className="px-1">
                  <p className={receipt.vip ? "font-semibold" : ""}>
                    {receipt.customer}
                  </p>

                  {receipt.vip ? (
                    <span className="bg-black px-1 text-[8px] font-bold text-white">
                      VIP #{receipt.customerId}
                    </span>
                  ) : receipt.customerId ? (
                    <p className="text-[9px] text-[#777]">
                      #{receipt.customerId}
                    </p>
                  ) : (
                    <p className="text-[9px] text-[#777]">Walk-in</p>
                  )}
                </td>

                <td className="px-1 text-right font-bold">
                  {receiptMoney(receipt.total)}
                </td>
              </tr>
            );
          })}

          {receipts.length === 0 && (
            <tr>
              <td colSpan={6} className="py-12 text-center text-xs text-[#777]">
                No receipt records match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
