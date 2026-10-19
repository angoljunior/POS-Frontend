import { Link } from "react-router-dom";
import { PlusSquare, FileText, PlusCircle } from "lucide-react";

import { dashboardStats } from "@/data/dashboardData";

import StatCard from "@/components/dashboard/StatCard";
import SalesTrend from "@/components/dashboard/SalesTrend";
import TopProducts from "@/components/dashboard/TopProducts";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import StockAlerts from "@/components/dashboard/StockAlerts";

export default function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4">
      {/* Page heading and actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-black">
            Dashboard Overview
          </h1>

          <p className="mt-0.5 text-[11px] text-[#777]">
            Real-time store performance metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-[6px]">
          <Link
            to="/products/new"
            className="inline-flex h-[30px] items-center gap-1 border border-black bg-white px-3 text-[10px] font-semibold text-black hover:bg-gray-100"
          >
            <PlusSquare size={12} />
            Add Product
          </Link>

          <Link
            to="/reports"
            className="inline-flex h-[30px] items-center gap-1 border border-black bg-white px-3 text-[10px] font-semibold text-black hover:bg-gray-100"
          >
            <FileText size={12} />
            Generate Report
          </Link>

          <Link
            to="/pos"
            className="inline-flex h-[30px] items-center gap-1 border border-black bg-black px-3 text-[10px] font-semibold text-white hover:bg-[#333]"
          >
            <PlusCircle size={12} />
            New Sale
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Sales chart and top products */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <SalesTrend />
        </div>

        <div className="min-w-0">
          <TopProducts />
        </div>
      </div>

      {/* Transactions and inventory alerts */}
      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <RecentTransactions />
        </div>

        <div className="min-w-0">
          <StockAlerts />
        </div>
      </div>
    </div>
  );
}
