import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { revenueData } from "@/data/reportsData";

export default function RevenueChart({ data = revenueData, onPeriodChange }) {
  const [period, setPeriod] = useState("30");
  const [showChart, setShowChart] = useState(false);

  const handlePeriodChange = (value) => {
    setPeriod(value);
    onPeriodChange?.(value);
  };

  return (
    <section className="flex h-[426px] min-w-0 flex-col border border-[#d8cece] bg-white p-[17px]">
      <div className="mb-[16px] flex items-center justify-between gap-3">
        <h2 className="text-[21px] font-semibold text-black">
          Revenue Over Time
        </h2>

        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="h-[32px] w-[143px] rounded-none border-[#d6cccc] bg-white text-[13px] shadow-none">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden border border-[#d8cece] bg-white">
        {!showChart ? (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent 0px, transparent 10px, #e3e3e3 11px, transparent 12px)",
            }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowChart(true)}
              className="h-[34px] rounded-none border-[#d5caca] bg-white px-3 text-[14px] text-[#555] shadow-none hover:bg-[#f5f5f5]"
            >
              View Interactive Chart
            </Button>
          </div>
        ) : (
          <div className="flex h-full flex-col p-3">
            <div className="mb-2 text-right">
              <button
                type="button"
                onClick={() => setShowChart(false)}
                className="text-[11px] text-[#666] underline"
              >
                Show Design Preview
              </button>
            </div>

            <div className="min-h-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 15,
                    left: -8,
                    bottom: 4,
                  }}
                >
                  <CartesianGrid
                    stroke="#e7e7e7"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `$${Number(value).toLocaleString()}`,
                      "Revenue",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#111111"
                    strokeWidth={2.5}
                    dot={{ fill: "#111111", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
