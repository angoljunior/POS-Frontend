import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const elementOptions = [
  ["productName", "Product Name"],
  ["sku", "SKU Identifier"],
  ["price", "Retail Price"],
  ["storeName", "Store Name Header"],
  ["readableSku", "Readable SKU Text"],
  ["batch", "Batch / Expiry Date"],
];

export default function LabelSettings({
  settings,
  setSettings,
  elements,
  setElements,
}) {
  function updateSetting(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-[12px] font-bold tracking-wide text-[#666]">
            BARCODE SYMBOLOGY
          </label>
          <Select value="code128" disabled>
            <SelectTrigger className="h-[42px] rounded-none border-[#8390a0] bg-[#f8f8f8]">
              <SelectValue placeholder="Code 128 (Standard)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="code128">Code 128 (Standard)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-[12px] font-bold tracking-wide text-[#666]">
            LABEL STOCK PROFILE
          </label>
          <Select value="2x1" disabled>
            <SelectTrigger className="h-[42px] rounded-none border-[#8390a0] bg-[#f8f8f8]">
              <SelectValue placeholder='2.0" × 1.0" (50×25mm)' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2x1">2.0" × 1.0" (50×25mm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="mb-1 text-[12px] font-bold tracking-wide text-[#666]">
          VISIBLE LABEL ELEMENTS
        </h3>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 bg-[#f3f3f3] p-2">
          {elementOptions.map(([key, title]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 text-[13px] text-[#444]"
            >
              <Checkbox
                checked={elements[key]}
                onCheckedChange={(checked) =>
                  setElements((current) => ({
                    ...current,
                    [key]: checked === true,
                  }))
                }
                className="h-[16px] w-[16px] rounded-none border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
              />
              {title}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-[#f3f3f3] p-2">
        <div>
          <p className="mb-1 text-[12px] font-bold tracking-wide text-[#666]">
            RESOLUTION
          </p>
          <div className="flex">
            {[203, 300].map((dpi) => (
              <button
                type="button"
                key={dpi}
                onClick={() => updateSetting("resolution", dpi)}
                className={`h-[31px] flex-1 text-[12px] ${
                  settings.resolution === dpi
                    ? "bg-black font-bold text-white"
                    : "bg-white text-[#555]"
                }`}
              >
                {dpi} DPI
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[12px] font-bold tracking-wide text-[#666]">
            DARKNESS / SPEED
          </p>
          <div className="flex items-center gap-2">
            <Slider
              min={0}
              max={30}
              step={1}
              value={[settings.darkness]}
              onValueChange={([value]) => updateSetting("darkness", value)}
            />
            <span className="text-[13px] font-bold">{settings.darkness}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
