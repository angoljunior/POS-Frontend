import {
  formatCustomerDate,
  formatCustomerCurrency,
} from "@/data/customersData";

export default function CustomerPurchases({ purchases = [] }) {
  return (
    <div>
      <h3 className="mb-[17px] text-[12px] font-semibold tracking-wide text-[#333]">
        RECENT PURCHASES
      </h3>

      <div className="space-y-[16px]">
        {purchases.length === 0 ? (
          <p className="text-[13px] text-[#777]">
            No recent purchases available.
          </p>
        ) : (
          purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="border border-[#d8cece] bg-[#fafafa] p-[9px]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14px] text-[#666]">
                  {formatCustomerDate(purchase.date)}
                </span>

                <span className="text-[14px] font-medium text-black">
                  {formatCustomerCurrency(purchase.total)}
                </span>
              </div>

              <p className="mt-[6px] text-[14px] text-black">
                Order #{purchase.id}
              </p>

              <p className="mt-1 truncate text-[13px] text-[#666]">
                {purchase.items} {purchase.items === 1 ? "item" : "items"}
                {purchase.description ? ` (${purchase.description})` : ""}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
