import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { CheckCircle2, RefreshCw, Loader2 } from "lucide-react";

import BarcodeHeader from "@/components/barcodes/BarcodeHeader";
import ProductLookup from "@/components/barcodes/ProductLookup";
import BatchQueue from "@/components/barcodes/BatchQueue";
import LabelSettings from "@/components/barcodes/LabelSettings";
import LabelPreview from "@/components/barcodes/LabelPreview";
import PrinterToolbar from "@/components/barcodes/PrinterToolbar";
import PrintableSheets from "@/components/barcodes/PrintableSheets";

import { initialElements } from "@/data/barcodeData";

import {
  expandLabels,
  paginateLabels,
  exportLabelsPDF,
  generateZPL,
  downloadText,
} from "@/lib/barcodeUtils";

import { barcodeCatalogApi } from "@/api/barcodeCatalog.api";

export default function BarcodeManagement() {
  // Live database data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Barcode batch data
  const [batch, setBatch] = useState([]);

  // Print configuration
  const [settings, setSettings] = useState({
    resolution: 203,
    darkness: 8,
  });

  const [elements, setElements] = useState(initialElements);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const printRef = useRef(null);
  const testPrintRef = useRef(null);

  // Load products, inventory and categories from Django
  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await barcodeCatalogApi.getCatalog();

      setProducts(response.products);
      setCategories(response.categories);

      // Refresh existing queue product information, retaining
      // deliberately selected print quantities.
      setBatch((current) => {
        const latest = new Map(
          response.products.map((product) => [product.id, product]),
        );

        return current.map((item) => {
          const updated = latest.get(item.id);

          if (!updated) {
            return {
              ...item,
              unavailable: true,
            };
          }

          return {
            ...updated,
            printQty: item.printQty,
            unavailable: false,
          };
        });
      });
    } catch (err) {
      setError(err.message || "Failed to load products from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  // Generate all requested labels.
  const validBatch = useMemo(
    () =>
      batch.filter(
        (item) => !item.unavailable && item.printQty > 0 && item.sku,
      ),
    [batch],
  );

  const labels = useMemo(() => expandLabels(validBatch), [validBatch]);

  const sheets = useMemo(() => paginateLabels(labels), [labels]);

  const totalPages = Math.max(sheets.length, 1);
  const currentPage = Math.min(page, totalPages);

  const currentLabels = sheets[currentPage - 1] || [];

  const printAll = useReactToPrint({
    contentRef: printRef,
    documentTitle: "NexaPOS Barcode Labels",
  });

  const testPrint = useReactToPrint({
    contentRef: testPrintRef,
    documentTitle: "NexaPOS Test Label",
  });

  // Add a real database product to the print batch.
  function addToBatch(product, quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 1000) {
      setError("Print quantity must be between 1 and 1000.");
      return;
    }

    setError("");
    setNotice(`${product.name} added to print batch.`);

    setBatch((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...product,
                printQty: Math.min(existing.printQty + quantity, 1000),
                unavailable: false,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          ...product,
          printQty: quantity,
          unavailable: false,
        },
      ];
    });

    setPage(1);
  }

  function changeQuantity(id, value) {
    const quantity = Number(value);

    if (!Number.isInteger(quantity) || quantity < 0 || quantity > 1000) {
      return;
    }

    setBatch((current) =>
      current.map((item) =>
        item.id === id ? { ...item, printQty: quantity } : item,
      ),
    );
  }

  function removeItem(id) {
    setBatch((current) => current.filter((item) => item.id !== id));
  }

  async function handlePDF() {
    try {
      setError("");
      await exportLabelsPDF(validBatch, settings, elements);
    } catch (err) {
      setError(err.message || "Unable to generate PDF labels.");
    }
  }

  function handleZPL() {
    try {
      setError("");

      const zpl = generateZPL(validBatch, settings, elements);

      downloadText(zpl, "nexapos-labels.zpl");
    } catch (err) {
      setError(err.message || "Unable to export ZPL.");
    }
  }

  return (
    <div className="min-h-full bg-[#ededed] text-black">
      <BarcodeHeader
        totalLabels={labels.length}
        onDownload={handlePDF}
        onPrint={printAll}
      />

      {/* Reload catalogue from Django */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ddd] bg-white px-4 py-2">
        <span className="text-[12px] text-[#666]">
          {loading
            ? "Loading catalogue..."
            : `${products.length} active products loaded from inventory`}
        </span>

        <button
          type="button"
          onClick={loadCatalog}
          disabled={loading}
          className="flex items-center gap-2 text-[12px] font-semibold hover:underline disabled:opacity-50"
        >
          <RefreshCw size={14} />
          Refresh Products
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="border-b border-[#ddd] bg-[#f5f5f5] px-4 py-2 text-xs"
        >
          {notice}
        </div>
      )}

      <div className="grid min-h-[760px] grid-cols-1 lg:grid-cols-[42%_58%]">
        {/* Left panel */}
        <div className="space-y-7 bg-white p-4">
          {loading && products.length === 0 ? (
            <div className="flex items-center gap-2 p-6 text-sm text-[#666]">
              <Loader2 className="h-5 w-5 animate-spin" />
              Retrieving products from Django...
            </div>
          ) : (
            <ProductLookup
              products={products}
              categories={categories}
              onAddProduct={addToBatch}
              loading={loading}
            />
          )}

          <BatchQueue
            batch={batch}
            onQuantityChange={changeQuantity}
            onRemove={removeItem}
            onClear={() => {
              setBatch([]);
              setNotice("");
            }}
          />

          <LabelSettings
            settings={settings}
            setSettings={setSettings}
            elements={elements}
            setElements={setElements}
          />
        </div>

        {/* Right panel */}
        <div className="flex min-w-0 flex-col gap-4 bg-[#efefef] p-4 lg:p-6">
          <PrinterToolbar
            page={currentPage}
            totalPages={totalPages}
            setPage={setPage}
            zoom={zoom}
            setZoom={setZoom}
          />

          <LabelPreview
            labels={currentLabels}
            elements={elements}
            zoom={zoom}
          />

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 bg-white p-4">
            <div className="flex max-w-[280px] items-start gap-2 text-[13px] leading-5 text-[#666]">
              <CheckCircle2 size={17} className="mt-1 shrink-0" />

              <span>
                Label preview is ready. Verify barcode readability and
                dimensions before printing.
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={testPrint}
                disabled={!labels.length}
                className="bg-[#f3f3f3] px-4 py-3 text-[12px] font-bold tracking-wide disabled:opacity-40"
              >
                TEST SINGLE PRINT
              </button>

              <button
                type="button"
                onClick={handleZPL}
                disabled={!labels.length}
                className="bg-[#f3f3f3] px-4 py-3 text-[12px] font-bold tracking-wide disabled:opacity-40"
              >
                EXPORT ZPL CODE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print documents */}
      <div className="absolute -left-[99999px] top-0">
        <div ref={printRef}>
          <PrintableSheets labels={labels} elements={elements} />
        </div>

        <div ref={testPrintRef}>
          <PrintableSheets labels={labels.slice(0, 1)} elements={elements} />
        </div>
      </div>
    </div>
  );
}
