import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { requestError } from "@/api/directories.api";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
};

export default function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
  onSave,
}) {
  const [form, setForm] = useState(() => Object.fromEntries(Object.keys(emptyForm).map((key) => [key, customer?.[key] || ""])));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const editing = Boolean(customer);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving) return;

    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError("First name and last name are required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSave({
        ...form,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
      });
      onOpenChange(false);
    } catch (failure) {
      setError(requestError(failure, "Unable to save customer."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => { if (!saving) onOpenChange(value); }}>
      <DialogContent className="sm:max-w-[470px]">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Customer" : "Add New Customer"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Update customer information."
              : "Enter customer information to create a new record."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                disabled={saving}
                id="first_name"
                name="first_name"
                value={form.first_name}
                onChange={updateField}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                disabled={saving}
                id="last_name"
                name="last_name"
                value={form.last_name}
                onChange={updateField}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
                disabled={saving}
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
                disabled={saving}
              id="phone"
              name="phone"
              value={form.phone}
              onChange={updateField}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
                disabled={saving}
              id="address"
              name="address"
              value={form.address}
              onChange={updateField}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : editing ? "Save Changes" : "Add Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
