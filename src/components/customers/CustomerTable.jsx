import { getCustomerName, formatCustomerDate } from "@/data/customersData";

export default function CustomerTable({ customers, selectedId, onSelect }) {
  return (
    <table className="w-full min-w-[540px] border-collapse text-left">
      <thead>
        <tr className="h-[44px] border-b border-[#d6cece] bg-[#e9e9e9] text-[13px] font-semibold tracking-wide text-[#333]">
          <th className="w-[28%] px-[18px]">Name</th>
          <th className="w-[36%] px-3">Contact</th>
          <th className="w-[14%] px-3 text-center">Points</th>
          <th className="w-[22%] px-3 text-right">Last Purchase</th>
        </tr>
      </thead>

      <tbody>
        {customers.length === 0 ? (
          <tr>
            <td colSpan={4} className="py-12 text-center text-sm text-[#666]">
              No customers found.
            </td>
          </tr>
        ) : (
          customers.map((customer) => {
            const selected = selectedId === customer.id;

            return (
              <tr
                key={customer.id}
                tabIndex={0}
                aria-selected={selected}
                onClick={() => onSelect(customer.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(customer.id);
                  }
                }}
                className={`h-[69px] cursor-pointer border-b border-[#d8cece] outline-none transition-colors last:border-b-0 hover:bg-[#f5f5f5] focus-visible:bg-[#f1f1f1] ${
                  selected
                    ? "bg-[#f8f8f8] shadow-[inset_2px_0_0_#000]"
                    : "bg-white"
                }`}
              >
                <td className="px-[18px] text-[14px] font-medium text-black">
                  {getCustomerName(customer)}
                </td>

                <td className="px-3">
                  <p className="text-[14px] text-black">
                    {customer.email || "—"}
                  </p>
                  <p className="mt-1 text-[13px] text-[#666]">
                    {customer.phone || "—"}
                  </p>
                </td>

                <td className="px-3 text-center text-[14px] font-medium text-black">
                  {customer.loyalty_points.toLocaleString()}
                </td>

                <td className="whitespace-nowrap px-3 text-right text-[13px] text-[#666]">
                  {formatCustomerDate(customer.last_purchase)}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
