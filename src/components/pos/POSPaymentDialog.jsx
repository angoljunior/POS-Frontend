import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/data/posData";

export default function POSPaymentDialog({
  open,
  onOpenChange,
  total,
  onConfirm,
  isProcessing,
  checkoutSupported,
}) {
  const [cashReceived, setCashReceived] = useState("");


  const received = Number(cashReceived);
  const validAmount =
    cashReceived !== "" && Number.isFinite(received) && received >= total;

  const change = validAmount ? received - total : 0;

  function handleConfirm() {
    if (!validAmount || !checkoutSupported || isProcessing) return;
    onConfirm(received);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-3">
          <div className="rounded-md bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Amount Due</p>
            <p className="mt-1 text-3xl font-bold">{formatCurrency(total)}</p>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button type="button" variant="default">
                Cash
              </Button>
              <Button type="button" variant="outline" disabled>
                Card
              </Button>
              <Button type="button" variant="outline" disabled>
                MoMo
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cash-received">Cash Received</Label>
            <Input
              id="cash-received"
              type="number"
              min="0"
              step="0.01"
              value={cashReceived}
              onChange={(event) => setCashReceived(event.target.value)}
              placeholder="Enter amount received"
            />
          </div>

          <div className="flex justify-between border-t pt-3">
            <span className="font-medium">Change Due</span>
            <span className="font-bold">{formatCurrency(change)}</span>
          </div>

          {!checkoutSupported && (
            <p className="text-xs text-amber-700">
              Discounts or taxes are not yet supported by the current Django
              checkout endpoint. Remove them or upgrade the backend before
              completing payment.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={!validAmount || !checkoutSupported || isProcessing}
            onClick={handleConfirm}
          >
            {isProcessing ? "Processing..." : "Complete Sale"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

