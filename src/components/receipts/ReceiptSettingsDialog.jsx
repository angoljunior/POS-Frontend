import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function ReceiptSettingsDialog({
  open,
  onOpenChange,
  settings,
  setSettings,
}) {
  function update(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Receipt Settings</DialogTitle>
          <DialogDescription>
            Customise the store information and thermal receipt layout.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {[
            ["storeName", "Store Name"],
            ["address", "Store Address"],
            ["phone", "Phone Number"],
            ["taxId", "Tax Identification Number"],
            ["footerText", "Receipt Footer Message"],
          ].map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                value={settings[key]}
                onChange={(event) => update(key, event.target.value)}
              />
            </div>
          ))}

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={settings.showBarcode}
              onCheckedChange={(checked) =>
                update("showBarcode", checked === true)
              }
            />
            Display receipt barcode
          </label>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={settings.showLoyalty}
              onCheckedChange={(checked) =>
                update("showLoyalty", checked === true)
              }
            />
            Display customer loyalty message
          </label>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
