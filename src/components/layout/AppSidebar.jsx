import {
  LayoutDashboard,
  Monitor,
  Package,
  ClipboardCheck,
  Users,
  Truck,
  ReceiptText,
  ChartColumn,
  Settings,
  Bot,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "POS", icon: Monitor, path: "/pos" },
  { name: "Products", icon: Package, path: "/products" },
  { name: "Inventory", icon: ClipboardCheck, path: "/inventory" },
  { name: "Customers", icon: Users, path: "/customers" },
  { name: "Suppliers", icon: Truck, path: "/suppliers" },
  { name: "Sales", icon: ReceiptText, path: "/sales" },
  { name: "Receipts", icon: ReceiptText, path: "/receipts" },
  { name: "Barcodes", icon: ReceiptText, path: "/barcodes" },
  { name: "Reports", icon: ChartColumn, path: "/reports" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function AppSidebar({ onNavigate }) {
  return (
    <aside className="flex h-full w-[180px] shrink-0 flex-col border-r border-[#d9d9d9] bg-[#e8e8e8]">
      <div className="flex h-[72px] items-center gap-2 border-b border-[#d0d0d0] px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded border border-black">
          <Bot className="h-5 w-5 text-black" />
        </div>

        <div>
          <p className="text-[13px] font-bold text-black">System Admin</p>
          <p className="mt-0.5 text-[10px] text-[#666]">Store #124</p>
        </div>
      </div>

      <nav className="flex-1 pt-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex h-[38px] items-center gap-3 px-2 text-[11px] transition-colors ${
                  isActive
                    ? "bg-white font-semibold text-black"
                    : "text-[#444] hover:bg-[#dedede]"
                }`
              }
            >
              <Icon className="h-[16px] w-[16px] shrink-0" strokeWidth={2} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-[#d0d0d0] px-2 py-3 text-center text-[10px] text-[#666]">
        v2.4.1
      </div>
    </aside>
  );
}
