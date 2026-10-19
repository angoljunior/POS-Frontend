import { Link } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  highValueTransactions,
  formatReportCurrency,
} from "@/data/reportsData";

export default function HighValueTransactions({
  transactions = highValueTransactions,
}) {
  return (
    <section className="overflow-hidden border border-[#d8cece] bg-white">
      <div className="flex min-h-[64px] items-center justify-between gap-3 border-b border-[#d8cece] bg-[#e9e9e9] px-[17px]">
        <h2 className="text-[21px] font-semibold text-black">
          Recent High-Value Transactions
        </h2>

        <Link
          to="/sales"
          className="shrink-0 text-[13px] font-semibold text-black hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow className="h-[36px] border-[#d8cece] bg-[#f6f6f6] hover:bg-[#f6f6f6]">
              <TableHead className="px-4 text-[12px] font-semibold tracking-wide text-[#444]">
                ORDER ID
              </TableHead>

              <TableHead className="text-[12px] font-semibold tracking-wide text-[#444]">
                DATE &amp; TIME
              </TableHead>

              <TableHead className="text-[12px] font-semibold tracking-wide text-[#444]">
                CUSTOMER
              </TableHead>

              <TableHead className="text-[12px] font-semibold tracking-wide text-[#444]">
                PAYMENT
              </TableHead>

              <TableHead className="pr-4 text-right text-[12px] font-semibold tracking-wide text-[#444]">
                AMOUNT
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-[#666]"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="h-[39px] border-[#d8cece] hover:bg-[#f8f8f8]"
                >
                  <TableCell className="px-4 text-[14px] font-medium text-black">
                    #{transaction.id}
                  </TableCell>

                  <TableCell className="text-[14px] text-[#555]">
                    {transaction.date}
                  </TableCell>

                  <TableCell className="text-[14px] text-black">
                    {transaction.customer}
                  </TableCell>

                  <TableCell className="text-[14px] text-[#555]">
                    {transaction.payment}
                  </TableCell>

                  <TableCell className="pr-4 text-right text-[14px] font-medium text-black">
                    {formatReportCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
