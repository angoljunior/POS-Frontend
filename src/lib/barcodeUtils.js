
import bwipjs from "bwip-js";
import { jsPDF } from "jspdf";
import { LABELS_PER_SHEET } from "@/data/barcodeData";

export function expandLabels(batch) {
  return batch.flatMap((item) =>
    Array.from(
      { length: item.printQty },
      () => ({ ...item })
    )
  );
}

export function paginateLabels(labels) {
  const sheets = [];
  for (let i = 0; i < labels.length; i += LABELS_PER_SHEET) {
    sheets.push(labels.slice(i, i + LABELS_PER_SHEET));
  }
  return sheets;
}

export function downloadText(content, filename, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function createBarcodeCanvas(value) {
  const canvas = document.createElement("canvas");

  bwipjs.toCanvas(canvas, {
    bcid: "code128",
    text: String(value),
    scale: 3,
    height: 9,
    includetext: false,
  });

  return canvas;
}

// PDF: 2 labels across and 3 rows per sheet.
// Each label is 50.8 × 25.4 mm (2" × 1").
export async function exportLabelsPDF(batch, settings, elements) {
  const labels = expandLabels(batch);
  if (!labels.length) throw new Error("Batch is empty.");

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [101.6, 76.2],
  });

  const width = 50.8;
  const height = 25.4;
  const margin = 2.5;

  labels.forEach((item, index) => {
    if (index > 0 && index % LABELS_PER_SHEET === 0) {
      doc.addPage([101.6, 76.2], "landscape");
    }

    const slot = index % LABELS_PER_SHEET;
    const x = (slot % 2) * width;
    const y = Math.floor(slot / 2) * height;

    doc.setDrawColor(235);
    doc.rect(x, y, width, height);

    let cursorY = y + 4.1;
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");

    if (elements.storeName || elements.price) {
      doc.setFontSize(7);
      if (elements.storeName) {
        doc.text("NEXUS POS", x + margin, cursorY);
      }
      if (elements.price) {
        doc.text(
          `$${Number(item.price).toFixed(2)}`,
          x + width - margin,
          cursorY,
          { align: "right" }
        );
      }
      cursorY += 4;
    }

    if (elements.productName) {
      doc.setFontSize(7);
      const name = doc.splitTextToSize(
        item.name,
        width - margin * 2
      )[0];
      doc.text(name, x + margin, cursorY);
      cursorY += 3.7;
    }

    const canvas = createBarcodeCanvas(
  item.barcode || item.sku
);
    const barcodeHeight = elements.batch ? 7.1 : 8.5;

    doc.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      x + margin,
      cursorY,
      width - margin * 2,
      barcodeHeight
    );
    cursorY += barcodeHeight + 2.7;

    if (elements.readableSku || elements.sku) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(
        item.sku,
        x + width / 2,
        cursorY,
        { align: "center" }
      );
    }

    if (elements.batch) {
      doc.setFontSize(5.4);
      doc.text(
        `LOC: ${item.location}  BATCH: ${item.batch}`,
        x + margin,
        y + height - 1.5
      );
    }
  });

  doc.save("nexapos-barcode-labels.pdf");
}

// This is a Code 128 ZPL template, designed for
// a compatible Zebra printer at 203 dpi.
export function generateZPL(batch, settings, elements) {
  const dpi = settings.resolution;
  const dotsPerMm = dpi / 25.4;
  const labelWidth = Math.round(50.8 * dotsPerMm);
  const labelHeight = Math.round(25.4 * dotsPerMm);
  const margin = Math.round(2 * dotsPerMm);

  // Reject control characters and ZPL command delimiters.
  const safe = (value) =>
    String(value ?? "")
      .replace(/[\^~\x00-\x1F\x7F]/g, "")
      .slice(0, 80);

  return batch
    .filter((item) => item.printQty > 0)
    .map((item) => {
      const commands = [
        "^XA",
        `^PW${labelWidth}`,
        `^LL${labelHeight}`,
        `^MD${Math.max(-30, Math.min(30, (settings.darkness - 15) * 2))}`,
      ];

      if (elements.storeName) {
        commands.push(
          `^FO${margin},${margin}^A0N,18,18^FDNEXUS POS^FS`
        );
      }

      if (elements.price) {
        commands.push(
          `^FO${Math.round(labelWidth * .65)},${margin}^A0N,18,18^FD$${Number(item.price).toFixed(2)}^FS`
        );
      }

      if (elements.productName) {
        commands.push(
          `^FO${margin},${Math.round(labelHeight * .20)}^A0N,17,15^FD${safe(item.name)}^FS`
        );
      }

      commands.push(
        `^FO${margin},${Math.round(labelHeight * .37)}^BY2,2,${Math.round(labelHeight * .30)}^BCN,${Math.round(labelHeight * .30)},N,N,N^FD${safe(item.sku)}^FS`
      );

      if (elements.readableSku || elements.sku) {
        commands.push(
          `^FO${margin},${Math.round(labelHeight * .73)}^A0N,17,17^FD${safe(item.sku)}^FS`
        );
      }

      if (elements.batch) {
        commands.push(
          `^FO${margin},${Math.round(labelHeight * .88)}^A0N,12,12^FD${safe(item.batch)}^FS`
        );
      }

      commands.push(`^PQ${item.printQty}`, "^XZ");
      return commands.join("\n");
    })
    .join("\n");
}
