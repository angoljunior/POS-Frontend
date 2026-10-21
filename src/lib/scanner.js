export function addScannedProduct(cart, product) {
  if (cart.some((item) => String(item.id) === String(product.id))) {
    throw new Error("Product has already been scanned / is already in the cart.");
  }
  if (!product.isActive) throw new Error("This product is inactive.");
  if (!Number.isFinite(Number(product.stock)) || Number(product.stock) < 1) {
    throw new Error("Insufficient stock for this product.");
  }
  return [...cart, { ...product, price: Number(product.price), quantity: 1 }];
}

// Serial lookups preserve scan order and ensure duplicate checks see prior additions.
export function createScanQueue(lookup, commit, report, pending) {
  let tail = Promise.resolve();
  let generation = 0;
  let count = 0;
  return {
    cancel() { generation += 1; count = 0; pending(0); },
    enqueue(raw) {
      const code = raw.trim();
      if (!code || code.length > 100 || [...code].some((c) => c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127)) {
        report("Enter a valid barcode or SKU (up to 100 characters).");
        return Promise.resolve();
      }
      const current = generation;
      pending(++count);
      tail = tail.then(async () => {
        if (current !== generation) return;
        try {
          const product = await lookup(code);
          if (current === generation) commit(product);
        } catch (error) {
          if (current === generation) report(error.response?.data?.detail || error.message || "Barcode lookup failed.");
        } finally {
          if (current === generation) pending(--count);
        }
      });
      return tail;
    },
  };
}
