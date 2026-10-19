import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Plus, RefreshCw, Search, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import StockBadge from "@/components/products/StockBadge";
import { productsCatalogApi } from "@/api/productsCatalog.api";

const PAGE_SIZE = 10;

const money = (value) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(Number(value ?? 0));

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await productsCatalogApi.getAll();

      setProducts(data.products);
      setCategories(data.categories);
      setBrands(data.brands);
    } catch (err) {
      console.error("Failed to fetch products:", err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to fetch products from the server.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.barcode.toLowerCase().includes(query);

      const matchesCategory =
        category === "all" || String(product.categoryId) === category;

      const matchesBrand = brand === "all" || String(product.brandId) === brand;

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "unknown" && product.stock === null) ||
        (stockFilter === "out" &&
          product.stock !== null &&
          product.stock <= 0) ||
        (stockFilter === "low" &&
          product.stock !== null &&
          product.stock > 0 &&
          product.stock <= product.reorderLevel) ||
        (stockFilter === "in" &&
          product.stock !== null &&
          product.stock > product.reorderLevel);

      return matchesSearch && matchesCategory && matchesBrand && matchesStock;
    });
  }, [products, search, category, brand, stockFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const allSelected =
    visibleProducts.length > 0 &&
    visibleProducts.every((p) => selectedIds.includes(p.id));

  function toggleProduct(id, checked) {
    setSelectedIds((current) =>
      checked
        ? [...new Set([...current, id])]
        : current.filter((value) => value !== id),
    );
  }

  function toggleAll(checked) {
    const ids = visibleProducts.map((p) => p.id);

    setSelectedIds((current) =>
      checked
        ? [...new Set([...current, ...ids])]
        : current.filter((id) => !ids.includes(id)),
    );
  }

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
    setSelectedIds([]);
  }

  return (
    <div className="min-h-full bg-[#fafafa] px-4 py-5">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[34px] font-bold tracking-tight text-black">
              Products
            </h1>

            <p className="mt-1 text-[14px] text-[#666]">
              Manage your inventory catalog, pricing, and availability.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={loadProducts}
              disabled={loading}
              className="h-[40px] gap-2 rounded-none"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>

            <Button
              asChild
              className="h-[40px] gap-2 rounded-none bg-black px-5 text-white hover:bg-[#222]"
            >
              <Link to="/products/new">
                <Plus size={17} />
                Add New Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 border border-[#ddd] bg-white p-4 md:grid-cols-4">
          <div className="relative md:col-span-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777]"
            />

            <Input
              value={search}
              onChange={(e) => updateFilter(setSearch, e.target.value)}
              placeholder="Search product or SKU..."
              className="h-[40px] rounded-none pl-9"
            />
          </div>

          <Select
            value={category}
            onValueChange={(value) => updateFilter(setCategory, value)}
          >
            <SelectTrigger className="h-[40px] w-full rounded-none">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>

              {categories.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={brand}
            onValueChange={(value) => updateFilter(setBrand, value)}
          >
            <SelectTrigger className="h-[40px] w-full rounded-none">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>

              {brands.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={stockFilter}
            onValueChange={(value) => updateFilter(setStockFilter, value)}
          >
            <SelectTrigger className="h-[40px] w-full rounded-none">
              <SelectValue placeholder="Stock Level" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in">In Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
              <SelectItem value="unknown">Unknown Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={18} />
            <div className="flex-1">
              <p>{error}</p>
              <Button
                variant="outline"
                onClick={loadProducts}
                className="mt-3 rounded-none"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Products table */}
        <div className="overflow-hidden border border-[#ddd] bg-white">
          <div className="overflow-x-auto">
            <Table className="min-w-[850px]">
              <TableHeader>
                <TableRow className="bg-[#ebebeb] hover:bg-[#ebebeb]">
                  <TableHead className="w-[55px] px-4">
                    <Checkbox
                      checked={
                        allSelected
                          ? true
                          : visibleProducts.some((p) =>
                                selectedIds.includes(p.id),
                              )
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={(checked) => toggleAll(checked === true)}
                      aria-label="Select all products"
                    />
                  </TableHead>

                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-[220px] text-center">
                      <div className="flex items-center justify-center gap-2 text-[#666]">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading products...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : visibleProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-[220px] text-center text-[#777]"
                    >
                      {error
                        ? "Unable to display products."
                        : "No products found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="h-[65px] border-[#e4e4e4]"
                    >
                      <TableCell className="px-4">
                        <Checkbox
                          checked={selectedIds.includes(product.id)}
                          onCheckedChange={(checked) =>
                            toggleProduct(product.id, checked === true)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Link
                          to={`/products/${product.id}`}
                          className="font-semibold text-black hover:underline"
                        >
                          {product.name}
                        </Link>
                      </TableCell>

                      <TableCell className="text-[#666]">
                        {product.sku}
                      </TableCell>

                      <TableCell>{product.category}</TableCell>

                      <TableCell>{product.brand}</TableCell>

                      <TableCell className="text-right font-medium">
                        {money(product.price)}
                      </TableCell>

                      <TableCell className="text-right">
                        {product.stock === null ? "—" : product.stock}
                      </TableCell>

                      <TableCell>
                        <StockBadge
                          stock={product.stock}
                          reorderLevel={product.reorderLevel}
                        />
                      </TableCell>

                      <TableCell className="text-right">
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="text-[13px] font-medium text-black hover:underline"
                        >
                          Edit
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ddd] bg-[#f2f2f2] px-4 py-3">
            <p className="text-[13px] text-[#666]">
              Showing{" "}
              {filteredProducts.length === 0
                ? 0
                : (currentPage - 1) * PAGE_SIZE + 1}
              {" – "}
              {Math.min(
                currentPage * PAGE_SIZE,
                filteredProducts.length,
              )} of {filteredProducts.length} products
            </p>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
                className="rounded-none"
              >
                Previous
              </Button>

              <span className="flex items-center px-2 text-[13px]">
                {currentPage} / {totalPages}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="rounded-none"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
