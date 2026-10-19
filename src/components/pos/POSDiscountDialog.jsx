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

export default function POSDiscountDialog({
  open,
  onOpenChange,
  discountPercent,
  onApply,
}) {
  const [value, setValue] = useState(discountPercent);


  function handleApply() {
    const percent = Number(value);

    if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
      return;
    }

    onApply(percent);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Apply Discount</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-3">
          <Label htmlFor="discount-percent">Discount Percentage (%)</Label>

          <Input
            id="discount-percent"
            type="number"
            min="0"
            max="100"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />

          <p className="text-xs text-muted-foreground">
            Enter a percentage between 0 and 100.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="button" onClick={handleApply}>
            Apply Discount
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

