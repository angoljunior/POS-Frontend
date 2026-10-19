import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import ReportsHeader from "@/components/reports/ReportsHeader";
import ReportStatCard from "@/components/reports/ReportStatCard";
import RevenueChart from "@/components/reports/RevenueChart";
import PaymentMethodChart from "@/components/reports/PaymentMethodChart";
import HighValueTransactions from "@/components/reports/HighValueTransactions";

import {
  reportStats,
  revenueData,
  paymentMethods,
  highValueTransactions,
  formatReportCurrency,
} from "@/data/reportsData";

function escapeCSV(value) {
  const raw = String(value ?? "");

  // Prevent spreadsheet applications from interpreting
  // imported cell values as formulas.
  const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;

  return `"${safe.replace(/"/g, '""')}"`;
}

export default function Reports() {
  const [period, setPeriod] = useState("30");
  const [error, setError] = useState("");

  // The sample data illustrates the design.
  // Replace it with API responses when integrating Django.
  const stats = reportStats;
  const revenue = revenueData;
  const methods = paymentMethods;
  const transactions = highValueTransactions;

  function handleExportCSV() {
    try {
      setError("");

      const rows = [
        ["NexaPOS Reports & Analytics"],
        ["Period", `Last ${period} Days`],
        [],
        ["Metric", "Value", "Comparison"],
        ...stats.map((stat) => [stat.title, stat.value, stat.change]),
        [],
        ["Payment Method", "Share"],
        ...methods.map((method) => [method.name, `${method.percentage}%`]),
        [],
        ["Order ID", "Date & Time", "Customer", "Payment", "Amount"],
        ...transactions.map((transaction) => [
          transaction.id,
          transaction.date,
          transaction.customer,
          transaction.payment,
          transaction.amount.toFixed(2),
        ]),
      ];

      const csv = rows.map((row) => row.map(escapeCSV).join(",")).join("\r\n");

      const blob = new Blob(["\uFEFF", csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "nexapos-reports.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Unable to export CSV.");
    }
  }

  function handleExportPDF() {
    try {
      setError("");

      const doc = new jsPDF();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("NexaPOS Reports & Analytics", 14, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Reporting selection: Last ${period} Days`, 14, 28);
      doc.text("Illustrative sample data - not live financial results", 14, 34);

      autoTable(doc, {
        startY: 42,
        head: [["Metric", "Value", "Comparison"]],
        body: stats.map((stat) => [stat.title, stat.value, stat.change]),
        theme: "grid",
        headStyles: { fillColor: [35, 35, 35] },
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 12,
        head: [["Payment Method", "Share"]],
        body: methods.map((method) => [method.name, `${method.percentage}%`]),
        theme: "grid",
        headStyles: { fillColor: [35, 35, 35] },
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 12,
        head: [["Order ID", "Date & Time", "Customer", "Payment", "Amount"]],
        body: transactions.map((transaction) => [
          transaction.id,
          transaction.date,
          transaction.customer,
          transaction.payment,
          formatReportCurrency(transaction.amount),
        ]),
        theme: "grid",
        headStyles: { fillColor: [35, 35, 35] },
        styles: { fontSize: 8 },
      });

      doc.save("nexapos-reports.pdf");
    } catch (err) {
      setError(err.message || "Unable to export PDF.");
    }
  }

  return (
    <div className="min-h-full bg-[#fafafa] px-[14px] py-[4px] text-black">
      <div className="mx-auto max-w-[1600px] space-y-[34px]">
        {/* Page title and exports */}
        <ReportsHeader
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
        />

        {error && (
          <div
            role="alert"
            className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-[17px] md:grid-cols-3">
          {stats.map((stat) => (
            <ReportStatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* Charts section */}
        <div className="grid grid-cols-1 items-start gap-[17px] lg:grid-cols-[2fr_0.98fr]">
          <RevenueChart data={revenue} onPeriodChange={setPeriod} />

          <PaymentMethodChart methods={methods} />
        </div>

        {/* Transactions table */}
        <HighValueTransactions transactions={transactions} />
      </div>
    </div>
  );
}
