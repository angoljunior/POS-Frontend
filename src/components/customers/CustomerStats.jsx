import { formatCustomerCurrency } from "@/data/customersData";

export default function CustomerStats({ customer }) {
  const stats = [
    {
      title: "LOYALTY POINTS",
      value: customer.loyalty_points.toLocaleString(),
    },
    {
      title: "STORE CREDIT",
      value: customer.store_credit == null ? "—" : formatCustomerCurrency(customer.store_credit),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-[17px]">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="flex h-[71px] flex-col items-center justify-center border border-[#d8cece] bg-[#fafafa]"
        >
          <p className="text-[12px] font-semibold tracking-[0.07em] text-[#555]">
            {stat.title}
          </p>
          <p className="mt-1 text-[21px] font-bold leading-tight text-black">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
