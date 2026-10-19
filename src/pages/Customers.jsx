import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomerDirectory from "@/components/customers/CustomerDirectory";
import CustomerDetails from "@/components/customers/CustomerDetails";
import CustomerFormDialog from "@/components/customers/CustomerFormDialog";

import { loadCustomers, saveCustomer } from "@/api/directories.api";
import { useRemoteData } from "@/hooks/useRemoteData";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 5;

export default function Customers() {
  const navigate = useNavigate();

  const { data, setData: setCustomers, loading, error, reload } = useRemoteData(loadCustomers);
  const customers = useMemo(() => data || [], [data]);
  const { hasPermission } = useAuth();
  const [selectedId, setSelectedId] = useState(null);

  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedId) || customers[0],
    [customers, selectedId],
  );

  const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE));

  const currentPage = Math.min(page, totalPages);

  const paginatedCustomers = customers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleAdd() {
    setEditingCustomer(null);
    setDialogOpen(true);
  }

  function handleEdit(customer) {
    setEditingCustomer(customer);
    setDialogOpen(true);
  }

  async function handleSave(fields) {
    const saved = await saveCustomer(editingCustomer?.id, fields);
    setCustomers((current) => editingCustomer
      ? current.map((customer) => customer.id === saved.id ? saved : customer)
      : [saved, ...(current || [])]);
    setSelectedId(saved.id);
    if (!editingCustomer) setPage(1);
  }

  function handleStartSale(customer) {
    // React Router location state can preselect the customer
    // when the POS page reads this value.
    navigate("/pos", {
      state: {
        selectedCustomerId: customer.id,
        selectedCustomerName: `${customer.first_name} ${customer.last_name}`,
      },
    });
  }

  return (
    <div className="min-h-[620px] bg-white">
      <div className="flex items-center justify-end gap-3 pb-3">
        <Button variant="outline" onClick={reload} disabled={loading || dialogOpen}>
          {loading ? "Loading..." : error ? "Retry" : "Refresh"}
        </Button>
      </div>
      {loading && <p role="status" className="p-4">Loading customers...</p>}
      {error && <p role="alert" className="p-4 text-sm text-red-700">{error}</p>}
      {!loading && !error &&
      <div className="grid min-h-[620px] grid-cols-1 gap-[25px] lg:grid-cols-[minmax(0,3fr)_minmax(350px,2fr)]">
        {/* Left panel */}
        <div className="min-h-[470px] min-w-0 lg:min-h-0">
          <CustomerDirectory
            customers={paginatedCustomers}
            selectedId={selectedCustomer?.id ?? null}
            onSelect={setSelectedId}
            onAdd={hasPermission("customers.create") ? handleAdd : undefined}
            page={currentPage}
            setPage={setPage}
            pageSize={PAGE_SIZE}
            totalItems={customers.length}
          />
        </div>

        {/* Right panel */}
        <div className="min-h-[540px] min-w-0 lg:min-h-0">
          <CustomerDetails
            customer={selectedCustomer}
            onEdit={hasPermission("customers.update") ? handleEdit : undefined}
            onStartSale={hasPermission("sales.create") ? handleStartSale : undefined}
          />
        </div>
      </div>}

      {dialogOpen && <CustomerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={editingCustomer}
        onSave={handleSave}
      />}
    </div>
  );
}
