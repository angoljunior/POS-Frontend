import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReceiptFilters({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
  paymentFilter,
  setPaymentFilter,
  statusFilter,
  setStatusFilter,
  count,
  onClear,
}) {
  return (
    <div className="border-b border-[#d7d0d0] bg-white px-1 py-3">
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
        <div className="relative">
          <Search
            size={12}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-[#666]"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search receipt..."
            className="h-[30px] rounded-none border-[#d5cece] pl-7 text-[10px]"
          />
        </div>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="h-[30px] w-full rounded-none text-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="h-[30px] w-full rounded-none text-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Payment: All</SelectItem>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
            <SelectItem value="Mobile Money">Mobile Money</SelectItem><SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-[30px] w-full rounded-none text-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status: All</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[9px] font-semibold text-[#555]">
          SHOWING: {count} MATCHING RECORDS
        </p>
        <button
          onClick={onClear}
          className="text-[9px] font-bold tracking-wide text-[#555] underline hover:text-black"
        >
          CLEAR QUERY
        </button>
      </div>
    </div>
  );
}
