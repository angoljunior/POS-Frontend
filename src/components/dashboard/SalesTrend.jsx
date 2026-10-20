import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";




export default function SalesTrend({ data = [] }) {
  return (
    <section className="flex h-[292px] min-w-0 flex-col border border-[#ded6d6] bg-white p-3">
      <div className="mb-3 flex items-center justify-between border-b border-[#eee] pb-2">
        <h2 className="text-[14px] font-bold text-black">
          Sales Trend (Weekly)
        </h2>

        <span
          variant="outline"
          size="sm"
          className="h-[25px] rounded-none px-2 text-[10px]"
        >
          Last 7 days · GHS
        </span>
      </div>

      <div className="min-h-0 flex-1 border border-[#e6e0e0] p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 14, right: 12, bottom: 4, left: -17 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />

            <Tooltip
              formatter={(value) => [
                `GHS ${Number(value).toLocaleString()}`,
                "Sales",
              ]}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#111111"
              strokeWidth={2}
              dot={{ r: 3, fill: "#111111" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
