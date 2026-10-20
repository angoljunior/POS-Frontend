import { Info } from "lucide-react";


export default function TopProducts({ products = [] }) {
  const highest = Math.max(...products.map((product) => product.units), 1);

  return (
    <section className="h-[292px] border border-[#ded6d6] bg-white p-3">
      <div className="mb-3 flex items-center justify-between border-b border-[#eee] pb-2">
        <h2 className="text-[14px] font-bold text-black">Top Products (7 days)</h2>

        <Info size={12} className="text-[#666]" />
      </div>

      <div className="space-y-3">
        {products.length === 0 && <p className="text-xs text-gray-500">No completed sales in the last 7 days.</p>}
        {products.map((product) => (
          <div key={product.id}>
            <div className="mb-1 flex items-center justify-between gap-2 text-[10px]">
              <span className="truncate font-medium text-black">
                {product.name}
              </span>

              <span className="shrink-0 text-black">{product.units} u.</span>
            </div>

            <div className="h-[6px] w-full border border-[#ddd] bg-[#e8e8e8]">
              <div
                className="h-full bg-black"
                style={{
                  width: `${(product.units / highest) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
