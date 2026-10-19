import { paymentMethods } from "@/data/reportsData";

export default function PaymentMethodChart({ methods = paymentMethods }) {
  return (
    <section className="flex h-[426px] flex-col border border-[#d8cece] bg-white p-[17px]">
      <h2 className="text-[21px] font-semibold text-black">
        Sales by Payment Method
      </h2>

      <div className="flex flex-1 flex-col justify-center gap-[27px]">
        {methods.map((method) => (
          <div key={method.id}>
            <div className="mb-[6px] flex items-center justify-between gap-2">
              <span className="text-[14px] text-[#333]">{method.name}</span>
              <span className="text-[14px] text-[#333]">
                {method.percentage}%
              </span>
            </div>

            <div
              className="h-[9px] w-full bg-[#e2e2e2]"
              role="progressbar"
              aria-label={method.name}
              aria-valuenow={method.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-black transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, method.percentage))}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
