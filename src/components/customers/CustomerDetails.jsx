import { Pencil, Mail, Phone, MapPin } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import CustomerStats from "./CustomerStats";
import CustomerPurchases from "./CustomerPurchases";
import { getCustomerName } from "@/data/customersData";

export default function CustomerDetails({ customer, onEdit, onStartSale }) {
  if (!customer) {
    return (
      <section className="flex h-full items-center justify-center border border-[#d8cece] bg-white p-6 text-center text-sm text-[#777]">
        Select a customer to view their details.
      </section>
    );
  }

  const fullName = getCustomerName(customer);

  const initials = `${customer.first_name?.[0] ?? ""}${
    customer.last_name?.[0] ?? ""
  }`.toUpperCase();

  return (
    <section className="flex h-full min-h-0 flex-col border border-[#d8cece] bg-white">
      {/* Customer profile header */}
      <div className="flex min-h-[85px] items-center gap-[17px] border-b border-[#d8cece] bg-[#fafafa] px-[17px]">
        <Avatar className="h-[51px] w-[51px]">
          <AvatarFallback className="bg-[#e9e9e9] text-[20px] font-semibold text-black">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[21px] font-bold leading-tight text-black">
            {fullName}
          </h2>


        </div>

        {onEdit && <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onEdit(customer)}
          aria-label={`Edit ${fullName}`}
          className="h-9 w-9 rounded-none text-[#555]"
        >
          <Pencil size={21} />
        </Button>}
      </div>

      {/* Loyalty and contact information */}
      <div className="border-b border-[#d8cece] px-[17px] py-[17px]">
        <CustomerStats customer={customer} />

        <div className="mt-[17px] space-y-[12px]">
          <div className="flex items-start gap-[10px]">
            <Mail size={16} className="mt-[2px] shrink-0 text-[#555]" />
            <span className="break-all text-[14px] text-[#333]">
              {customer.email || "No email address"}
            </span>
          </div>

          <div className="flex items-start gap-[10px]">
            <Phone size={16} className="mt-[2px] shrink-0 text-[#555]" />
            <span className="text-[14px] text-[#333]">
              {customer.phone || "No phone number"}
            </span>
          </div>

          <div className="flex items-start gap-[10px]">
            <MapPin size={16} className="mt-[2px] shrink-0 text-[#555]" />
            <span className="whitespace-pre-line text-[14px] leading-[21px] text-[#333]">
              {customer.address || "No address provided"}
            </span>
          </div>
        </div>
      </div>

      {/* Recent purchases */}
      <div className="min-h-0 flex-1 overflow-y-auto px-[17px] py-[17px]">
        {customer.purchases ? <CustomerPurchases purchases={customer.purchases} /> : <p className="text-sm text-[#777]">Purchase history is not available.</p>}
      </div>

      {/* Bottom action */}
      {onStartSale && <div className="shrink-0 border-t border-[#d8cece] bg-[#fafafa] p-[17px]">
        <Button
          type="button"
          variant="outline"
          onClick={() => onStartSale(customer)}
          className="h-[37px] w-full rounded-none border-[#888] bg-white text-[13px] font-semibold tracking-wide text-black shadow-none hover:bg-[#eee]"
        >
          Open POS
        </Button>
      </div>}
    </section>
  );
}
