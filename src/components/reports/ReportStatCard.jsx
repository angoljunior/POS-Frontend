import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ReportStatCard({ title, value, change, trend }) {
  const TrendIcon = trend === "down" ? TrendingDown : TrendingUp;

  return (
    <Card className="min-h-[121px] gap-0 rounded-none border-[#d8cece] bg-white py-0 shadow-none">
      <CardContent className="p-[17px]">
        <p className="text-[13px] font-semibold tracking-[0.07em] text-[#666]">
          {title}
        </p>

        <h2 className="mt-[9px] text-[27px] font-bold leading-none tracking-tight text-black">
          {value}
        </h2>

        <div className="mt-[12px] flex items-center gap-2 text-[14px] text-[#555]">
          <TrendIcon size={16} className="shrink-0 text-black" />
          <span>{change}</span>
        </div>
      </CardContent>
    </Card>
  );
}
