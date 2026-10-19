
export const dashboardStats = [
  {
    title: "TODAY'S SALES",
    value: "$12,450.00",
    change: "+8.2% vs yesterday",
    trend: "up",
    icon: "dollar",
  },
  {
    title: "NET REVENUE",
    value: "$9,230.50",
    change: "+5.1% vs yesterday",
    trend: "up",
    icon: "revenue",
  },
  {
    title: "TOTAL ORDERS",
    value: "342",
    change: "Steady volume",
    trend: "neutral",
    icon: "orders",
  },
  {
    title: "NEW CUSTOMERS",
    value: "28",
    change: "-2.4% vs yesterday",
    trend: "down",
    icon: "customers",
  },
];

export const weeklySales = [
  { day: "Mon", sales: 1100 },
  { day: "Tue", sales: 1850 },
  { day: "Wed", sales: 1450 },
  { day: "Thu", sales: 2400 },
  { day: "Fri", sales: 2050 },
  { day: "Sat", sales: 2750 },
  { day: "Sun", sales: 850 },
];

export const topProducts = [
  { id: 1, name: "Wireless Earbuds X1", units: 142 },
  { id: 2, name: "Pro Desk Lamp", units: 98 },
  { id: 3, name: "Ergo Mouse V2", units: 76 },
  { id: 4, name: "Mechanical Keyboard", units: 45 },
  { id: 5, name: "USB-C Hub", units: 32 },
];

export const recentTransactions = [
  {
    id: "90214",
    time: "10:42 AM",
    items: 3,
    total: 245.5,
    status: "COMPLETED",
  },
  {
    id: "90213",
    time: "10:28 AM",
    items: 1,
    total: 89.0,
    status: "COMPLETED",
  },
  {
    id: "90212",
    time: "10:15 AM",
    items: 5,
    total: 412.25,
    status: "PROCESSING",
  },
  {
    id: "90211",
    time: "09:55 AM",
    items: 2,
    total: 120.0,
    status: "VOIDED",
  },
];

export const stockAlerts = [
  {
    id: 1,
    name: "HD Web Camera C920",
    sku: "CAM-002",
    quantity: 2,
    status: "LEFT",
  },
  {
    id: 2,
    name: "Ethernet Cable 10ft",
    sku: "CBL-104",
    quantity: 0,
    status: "OUT OF STOCK",
  },
  {
    id: 3,
    name: "Monitor Stand VESA",
    sku: "MNT-099",
    quantity: 5,
    status: "LOW",
  },
];
