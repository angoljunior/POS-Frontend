import { Link } from "react-router-dom";
import { PlusSquare, FileText, PlusCircle } from "lucide-react";

import { useRemoteData } from "@/hooks/useRemoteData";
import { useAuth } from "@/context/AuthContext";
import { loadDashboard } from "@/api/overview.api";
import { saleMoney } from "@/api/salesHistory.api";

import StatCard from "@/components/dashboard/StatCard";
import SalesTrend from "@/components/dashboard/SalesTrend";
import TopProducts from "@/components/dashboard/TopProducts";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import StockAlerts from "@/components/dashboard/StockAlerts";

export default function Dashboard() {
  const { data, loading, error, reload } = useRemoteData(loadDashboard);
  const { hasPermission } = useAuth();
  if (loading || error) return <div role={error ? "alert" : "status"} className="border p-6 text-sm">{error || "Loading dashboard..."}{error && <button onClick={reload} className="ml-3 underline">Retry</button>}</div>;
  const dashboardStats = [
    { title: "TODAY'S SALES", value: saleMoney(data.today_sales), change: "Completed sales · Accra time", icon: "dollar" },
    { title: "TODAY'S TRANSACTIONS", value: data.transactions, change: "Completed sales", icon: "orders" },
    { title: "ACTIVE PRODUCTS", value: data.total_products, change: "Current catalog", icon: "revenue" },
    { title: "LOW STOCK PRODUCTS", value: data.low_stock_count, change: "At or below reorder level", icon: "orders" },
  ].map((stat) => ({ ...stat, trend: "neutral" }));
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4">
      {/* Page heading and actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-black">
            Dashboard Overview
          </h1>

          <p className="mt-0.5 text-[11px] text-[#777]">
            Latest store performance · {data.as_of} (Accra)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-[6px]">
          {hasPermission("products.view") && <Link
            to="/products"
            className="inline-flex h-[30px] items-center gap-1 border border-black bg-white px-3 text-[10px] font-semibold text-black hover:bg-gray-100"
          >
            <PlusSquare size={12} />
            View Products
          </Link>}

          {hasPermission("reports.view") && <Link
            to="/reports"
            className="inline-flex h-[30px] items-center gap-1 border border-black bg-white px-3 text-[10px] font-semibold text-black hover:bg-gray-100"
          >
            <FileText size={12} />
            Generate Report
          </Link>}

          {hasPermission("sales.create") && <Link
            to="/pos"
            className="inline-flex h-[30px] items-center gap-1 border border-black bg-black px-3 text-[10px] font-semibold text-white hover:bg-[#333]"
          >
            <PlusCircle size={12} />
            New Sale
          </Link>}
          <button onClick={reload} className="border border-black px-3 py-1 text-xs">Refresh</button>
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
          <SalesTrend data={data.weekly_sales.map((row) => ({ ...row, sales: Number(row.sales) }))} />
        </div>

        <div className="min-w-0">
          <TopProducts products={data.top_products} />
        </div>
      </div>

      {/* Transactions and inventory alerts */}
      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          {hasPermission("sales.view") && <RecentTransactions transactions={data.recent_sales.map((sale) => ({ ...sale, time: new Date(sale.created_at).toLocaleString("en-GH", { timeZone: "Africa/Accra" }), items: sale.items.reduce((sum, item) => sum + Number(item.quantity), 0) }))} />}
        </div>

        <div className="min-w-0">
          {hasPermission("inventory.view") && <StockAlerts alerts={data.stock_alerts} />}
        </div>
      </div>
    </div>
  );
}
