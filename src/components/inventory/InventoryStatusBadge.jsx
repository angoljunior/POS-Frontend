export default function InventoryStatusBadge({ status }) {
  const styles = {
    in: {
      label: "In Stock",
      className: "border-[#d0caca] bg-[#e8e8e8] text-[#666]",
    },
    low: {
      label: "Low Stock",
      className: "border-[#f4abab] bg-[#fff0f0] text-[#d60000]",
    },
    out: {
      label: "Out of Stock",
      className: "border-[#f4abab] bg-[#fff0f0] text-[#d60000]",
    },
  };

  const config = styles[status] ?? styles.in;

  return (
    <span
      className={`inline-flex whitespace-nowrap border px-[9px] py-[3px] text-[12px] font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
