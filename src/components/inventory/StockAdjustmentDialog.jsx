import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestError } from "@/api/directories.api";

export default function StockAdjustmentDialog({ open, onOpenChange, inventory, onSave }) {
  const [inventoryId, setInventoryId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const selected = inventory.find((item) => String(item.id) === inventoryId);

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    const amount = Number(quantity);
    if (!selected || quantity.trim() === "" || !Number.isInteger(amount) || amount < 0 || amount > 2147483647) {
      setError("Select a product and enter a whole quantity between 0 and 2147483647.");
      return;
    }
    if (!reason.trim()) { setError("Please provide a reason for the change."); return; }
    setSaving(true);
    setError("");
    try {
      await onSave(selected.id, amount, selected.onHand, reason.trim());
      onOpenChange(false);
    } catch (failure) {
      setError(requestError(failure, "Unable to update stock."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => { if (!saving) onOpenChange(value); }}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Modify Stock Quantity</DialogTitle>
          <DialogDescription>Enter the new total quantity on hand. This replaces the current quantity.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inventory-product">Product</Label>
            <select id="inventory-product" className="h-10 w-full rounded-md border px-3" value={inventoryId} disabled={saving} required onChange={(event) => {
              const id = event.target.value;
              setInventoryId(id);
              setQuantity(String(inventory.find((item) => String(item.id) === id)?.onHand ?? ""));
              setError("");
            }}>
              <option value="">Select product</option>
              {inventory.map((item) => <option key={item.id} value={String(item.id)}>{item.name} - {item.sku}</option>)}
            </select>
          </div>
          {selected && <p className="text-sm">Current quantity: {selected.onHand}</p>}
          <div className="space-y-2">
            <Label htmlFor="stock-quantity">New quantity</Label>
            <Input id="stock-quantity" type="number" min="0" max="2147483647" step="1" required disabled={saving} value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock-reason">Reason</Label>
            <Input id="stock-reason" required disabled={saving} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="e.g. Physical stock count" />
          </div>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Quantity"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
