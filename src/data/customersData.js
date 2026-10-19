
export const initialCustomers = [
  {
    id: 1,
    first_name: "Eleanor",
    last_name: "Vance",
    email: "el.vance@email.com",
    phone: "555-0192",
    address: "412 Maple Street, Apt 4B\nCityville, ST 12345",
    loyalty_points: 1240,
    store_credit: 45,
    membership: "VIP Tier",
    last_purchase: "2023-10-24",
    purchases: [
      {
        id: "INV-8892",
        date: "2023-10-24",
        total: 124.5,
        items: 3,
        description: "Artisan Coffee Beans, Ceramic Mug...",
      },
      {
        id: "INV-8104",
        date: "2023-10-10",
        total: 42,
        items: 1,
        description: "French Press 32oz",
      },
    ],
  },
  {
    id: 2,
    first_name: "Marcus",
    last_name: "Sterling",
    email: "m.sterling@co.net",
    phone: "555-8831",
    address: "",
    loyalty_points: 850,
    store_credit: 0,
    membership: "Standard",
    last_purchase: "2023-10-21",
    purchases: [],
  },
  {
    id: 3,
    first_name: "Sarah",
    last_name: "Chen",
    email: "schen99@mail.org",
    phone: "555-4011",
    address: "",
    loyalty_points: 3400,
    store_credit: 0,
    membership: "VIP Tier",
    last_purchase: "2023-10-20",
    purchases: [],
  },
  {
    id: 4,
    first_name: "James",
    last_name: "Wilson",
    email: "jwilson@mail.com",
    phone: "555-7729",
    address: "",
    loyalty_points: 120,
    store_credit: 0,
    membership: "Standard",
    last_purchase: "2023-09-15",
    purchases: [],
  },
  {
    id: 5,
    first_name: "Priya",
    last_name: "Patel",
    email: "ppatel@studio.com",
    phone: "555-9002",
    address: "",
    loyalty_points: 2105,
    store_credit: 0,
    membership: "VIP Tier",
    last_purchase: "2023-09-12",
    purchases: [],
  },
];

export const getCustomerName = (customer) =>
  `${customer.first_name} ${customer.last_name}`.trim();

export const formatCustomerDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${date}T12:00:00Z`))
    : "—";

export const formatCustomerCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value ?? 0));
