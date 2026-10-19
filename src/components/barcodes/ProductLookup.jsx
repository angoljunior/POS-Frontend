import { useMemo, useState } from "react";
import { Barcode, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ProductLookup({
  products = [],
  categories = [],
  onAddProduct,
  loading = false,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [productId, setProductId] = useState("");
  const [preset, setPreset] = useState("stock");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "all" || product.category === category;

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        String(product.barcode || "")
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  // Select the first matching product if the previous
  // selection is no longer in the filtered catalogue.
  const selectedProduct =
    filteredProducts.find((product) => String(product.id) === productId) ||
    filteredProducts[0];

  function handleAdd() {
    if (!selectedProduct) return;

    const quantity =
      preset === "stock" ? selectedProduct.stock : Number(preset);

    if (quantity === null || !Number.isInteger(quantity) || quantity <= 0) {
      return;
    }

    onAddProduct(selectedProduct, quantity);
  }

  function handleScannerEnter(event) {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const scanned = search.trim();

    const matchedProduct = products.find(
      (product) => product.barcode === scanned || product.sku === scanned,
    );

    if (matchedProduct) {
      setCategory("all");
      setProductId(String(matchedProduct.id));
      setSearch(matchedProduct.sku);
    }
  }

  return (
    <section className="bg-[#f4f4f4] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[12px] font-bold tracking-[0.1em] text-[#666]">
          PRODUCT LOOKUP
        </h2>

        <span className="text-[13px] text-[#555]">
          Scanner:{" "}
          <strong className="text-black">
            {loading ? "LOADING" : "READY"}
          </strong>
        </span>
      </div>

      {/* Product search / barcode scanning */}
      <div className="relative">
        <Barcode
          size={18}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-[#555]"
        />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={handleScannerEnter}
          placeholder="Scan barcode or search products..."
          disabled={loading}
          className="h-[43px] rounded-none border-[#8390a0] bg-white pl-10 text-[13px]"
        />
      </div>

      {/* Matching products */}
      <div className="mt-2">
        <Select
          value={selectedProduct ? String(selectedProduct.id) : ""}
          onValueChange={setProductId}
          disabled={loading || filteredProducts.length === 0}
        >
          <SelectTrigger className="h-[39px] w-full rounded-none border-[#8390a0] bg-white">
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>

          <SelectContent>
            {filteredProducts.map((product) => (
              <SelectItem key={product.id} value={String(product.id)}>
                {product.sku} • {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {/* Category */}
        <div>
          <label className="mb-1 block text-[12px] font-bold tracking-wide text-[#666]">
            CATEGORY FILTER
          </label>

          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setProductId("");
            }}
          >
            <SelectTrigger className="h-[39px] rounded-none border-[#8390a0] bg-white">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>

              {categories.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Print quantity preset */}
        <div>
          <label className="mb-1 block text-[12px] font-bold tracking-wide text-[#666]">
            PRESET STOCK QTY
          </label>

          <Select value={preset} onValueChange={setPreset}>
            <SelectTrigger className="h-[39px] rounded-none border-[#8390a0] bg-white">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="stock">Match On-Hand Total</SelectItem>
              <SelectItem value="1">1 Label</SelectItem>
              <SelectItem value="10">10 Labels</SelectItem>
              <SelectItem value="50">50 Labels</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selected product information */}
      {selectedProduct && (
        <div className="mt-3 border border-[#dedede] bg-white p-2 text-[12px]">
          <p className="truncate font-semibold">{selectedProduct.name}</p>

          <div className="mt-1 flex justify-between text-[#555]">
            <span>SKU: {selectedProduct.sku}</span>
            <span>
              On Hand:{" "}
              {selectedProduct.stock === null
                ? "Unknown"
                : selectedProduct.stock}
            </span>
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={handleAdd}
        disabled={
          loading ||
          !selectedProduct ||
          (preset === "stock" &&
            (!Number.isInteger(selectedProduct.stock) ||
              selectedProduct.stock <= 0))
        }
        className="mt-3 h-[39px] w-full gap-2 rounded-none bg-black text-[12px] font-bold tracking-wide text-white hover:bg-[#222]"
      >
        <PlusCircle size={16} />
        ADD PRODUCT TO BATCH
      </Button>
    </section>
  );
}
