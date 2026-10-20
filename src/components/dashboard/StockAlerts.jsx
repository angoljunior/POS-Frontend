import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";


export default function StockAlerts({ alerts = [] }) {
  return (
    <section className="overflow-hidden border border-[#ded6d6] bg-white">
      <div className="flex h-[44px] items-center gap-2 border-b border-[#ddd] bg-[#f3f3f3] px-3">
        <AlertTriangle size={13} className="text-black" fill="black" />
        <h2 className="text-[14px] font-bold text-black">Stock Alerts</h2>
      </div>

      <div>
        {alerts.length === 0 && <p className="p-3 text-xs text-gray-500">No low stock alerts.</p>}
        {alerts.map((item) => (
          <div
            key={item.id}
            className="flex min-h-[46px] items-center justify-between gap-3 border-b border-[#eee] px-2 py-1"
          >
            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium text-black">
                {item.name}
              </p>
              <p className="text-[9px] tracking-wide text-[#555]">
                SKU: {item.sku}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p
                className={`text-[15px] font-bold leading-tight ${
                  item.quantity <= 2 ? "text-red-600" : "text-black"
                }`}
              >
                {item.quantity}
              </p>

              <p className="text-[9px] tracking-wide text-[#555]">
                {item.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#f3f3f3] px-2 py-2 text-center">
        <Link
          to="/inventory"
          className="text-[10px] font-bold text-black underline"
        >
          VIEW INVENTORY
        </Link>
      </div>
    </section>
  );
}
