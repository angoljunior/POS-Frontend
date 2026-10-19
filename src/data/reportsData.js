
export const reportStats = [
  {
    id: "sales",
    title: "TOTAL SALES",
    value: "$124,500.00",
    change: "+12.5% vs last month",
    trend: "up",
  },
  {
    id: "profit",
    title: "NET PROFIT",
    value: "$32,100.50",
    change: "+8.2% vs last month",
    trend: "up",
  },
  {
    id: "turnover",
    title: "INVENTORY TURNOVER",
    value: "4.2x",
    change: "-0.5x vs last month",
    trend: "down",
  },
];

export const revenueData = [
  { date: "Oct 1", revenue: 2400 },
  { date: "Oct 5", revenue: 3950 },
  { date: "Oct 10", revenue: 3100 },
  { date: "Oct 15", revenue: 5700 },
  { date: "Oct 20", revenue: 4800 },
  { date: "Oct 25", revenue: 6800 },
  { date: "Oct 30", revenue: 5900 },
];

export const paymentMethods = [
  { id: "cash", name: "Cash", percentage: 35 },
  { id: "card", name: "Card", percentage: 50 },
  { id: "wallet", name: "Digital Wallet", percentage: 15 },
];

export const highValueTransactions = [
  {
    id: "ORD-9921",
    date: "Oct 24, 14:32",
    customer: "Walk-in Customer",
    payment: "Card",
    amount: 450.0,
  },
  {
    id: "ORD-9920",
    date: "Oct 24, 13:15",
    customer: "Alice Johnson",
    payment: "Digital Wallet",
    amount: 320.5,
  },
  {
    id: "ORD-9915",
    date: "Oct 24, 11:05",
    customer: "Tech Corp Inc.",
    payment: "Bank Transfer",
    amount: 1250.0,
  },
];

export const formatReportCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount ?? 0));
