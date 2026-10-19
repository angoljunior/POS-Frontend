import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { recentTransactions } from "@/data/dashboardData";

const statusStyles = {
  COMPLETED: "border-black bg-white text-black",
  PROCESSING: "border-[#999] bg-[#eee] text-[#666]",
  VOIDED: "border-red-500 bg-white text-red-600",
};

export default function RecentTransactions({
  transactions = recentTransactions,
}) {
  const formatMoney = (value) => `$${Number(value).toFixed(2)}`;

  return (
    <section className="overflow-hidden border border-[#ded6d6] bg-white">
      <div className="flex h-[44px] items-center justify-between border-b border-[#ddd] bg-[#f3f3f3] px-3">
        <h2 className="text-[14px] font-bold text-black">
          Recent Transactions
        </h2>

        <Link
          to="/sales"
          className="text-[10px] font-bold text-black underline"
        >
          VIEW ALL
        </Link>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[450px] border-collapse text-left">
          <thead className="bg-[#e8e8e8]">
            <tr className="text-[9px] font-semibold tracking-wide text-[#666]">
              <th className="px-2 py-1">TXN ID</th>
              <th className="px-2 py-1">TIME</th>
              <th className="px-2 py-1">ITEMS</th>
              <th className="px-2 py-1">TOTAL</th>
              <th className="px-2 py-1">STATUS</th>
              <th className="px-2 py-1 text-center">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-[#ddd] text-[10px] text-black last:border-0"
              >
                <td className="border-r border-[#ddd] px-2 py-2 font-bold">
                  #{transaction.id}
                </td>

                <td className="border-r border-[#ddd] px-2 py-2 text-[#555]">
                  {transaction.time}
                </td>

                <td className="border-r border-[#ddd] px-2 py-2">
                  {transaction.items}
                </td>

                <td className="border-r border-[#ddd] px-2 py-2 font-bold">
                  {formatMoney(transaction.total)}
                </td>

                <td className="border-r border-[#ddd] px-2 py-2">
                  <span
                    className={`inline-block border px-1.5 py-1 text-[9px] font-semibold ${
                      statusStyles[transaction.status] || "border-gray-300"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>

                <td className="px-2 py-2 text-center">
                  <Link
                    to={`/sales/${transaction.id}`}
                    aria-label={`View transaction ${transaction.id}`}
                    className="inline-flex text-[#555] hover:text-black"
                  >
                    <Eye size={13} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
