

export default function ReceiptStats({ metrics = [] }) {
  return (
    <div className="grid grid-cols-2 border-b border-[#d6d0d0] bg-[#f4f4f4] lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className="flex min-h-[81px] flex-col justify-between border-r border-b border-[#d6d0d0] px-3 py-3 last:border-r-0 lg:border-b-0"
        >
          <p className="text-[9px] font-semibold tracking-[0.04em] text-[#555]">
            {metric.title}
          </p>
          <div className="flex flex-wrap items-end justify-between gap-1">
            <p className="text-[25px] font-bold leading-none tracking-tight text-black">
              {metric.value}
            </p>
            <p className="text-[10px] text-[#666]">{metric.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
