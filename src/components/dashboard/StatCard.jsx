import {
  DollarSign,
  Wallet,
  ReceiptText,
  UserRoundPlus,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";

const icons = {
  dollar: DollarSign,
  revenue: Wallet,
  orders: ReceiptText,
  customers: UserRoundPlus,
};

export default function StatCard({ title, value, change, trend, icon }) {
  const Icon = icons[icon] || DollarSign;

  return (
    <div className="min-h-[94px] border border-[#ded6d6] bg-white">
      <div className="flex h-[25px] items-center justify-between border-b border-[#eee]">
        <span className="px-3 text-[9px] font-medium tracking-wide text-[#444]">
          {title}
        </span>

        <div className="flex h-full w-6 items-center justify-center border-l border-[#ddd] bg-[#f5f5f5]">
          <Icon size={12} className="text-[#555]" />
        </div>
      </div>

      <div className="px-3 pt-3">
        <div className="text-[20px] font-extrabold leading-none tracking-tight text-black">
          {value}
        </div>

        <div
          className={`mt-2 flex items-center gap-1 text-[10px] ${
            trend === "down"
              ? "text-red-600"
              : trend === "neutral"
                ? "text-[#666]"
                : "text-black"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp size={12} />
          ) : trend === "down" ? (
            <TrendingDown size={12} />
          ) : (
            <ArrowRight size={12} />
          )}

          <span>{change}</span>
        </div>
      </div>
    </div>
  );
}
