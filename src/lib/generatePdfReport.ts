import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ReportItem } from "@/components/invoice/InvoiceTable";

interface PdfReportOptions {
  items: ReportItem[];
  startDate: string;
  endDate: string;
  categoryName?: string;
  productName?: string;
}

export function generatePdfReport({
  items,
  startDate,
  endDate,
  categoryName,
  productName,
}: PdfReportOptions) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryColor: [number, number, number] = [20, 184, 166]; // Teal #14b8a6
  const textColor: [number, number, number] = [30, 41, 59]; // Slate-800
  const headerBgColor: [number, number, number] = [15, 23, 42]; // Slate-900

  doc.setFillColor(...headerBgColor);
  doc.rect(0, 0, 210, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("BursaAMVBG", 14, 15);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Laporan Rekapitulasi Penjualan", 14, 23);

  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  const dateText = `Periode: ${startDate || "Awal"} s/d ${endDate || "Hari Ini"}`;
  doc.text(dateText, 196, 15, { align: "right" });

  let filterDesc = [];
  if (categoryName) filterDesc.push(`Kategori: ${categoryName}`);
  if (productName) filterDesc.push(`Produk: ${productName}`);
  if (filterDesc.length > 0) {
    doc.text(filterDesc.join(" | "), 196, 23, { align: "right" });
  }

  let currentY = 40;

  const groupedByDate: Record<string, ReportItem[]> = {};

  items.forEach((item) => {
    const dateKey = new Date(item.createdAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(item);
  });

  let grandTotalQty = 0;
  let grandTotalRevenue = 0;
  let grandTotalProfit = 0;

  Object.keys(groupedByDate).forEach((dateStr, groupIdx) => {
    const dayItems = groupedByDate[dateStr];

    let dayQty = 0;
    let dayRevenue = 0;
    let dayProfit = 0;

    const tableRows = dayItems.map((item, idx) => {
      dayQty += item.quantity;
      dayRevenue += item.revenue;
      dayProfit += item.profit;

      return [
        (idx + 1).toString(),
        item.productQrCode,
        item.productName,
        item.categoryName,
        `Rp ${item.price.toLocaleString("id-ID")}`,
        item.quantity.toString(),
        `Rp ${item.revenue.toLocaleString("id-ID")}`,
        `Rp ${item.profit.toLocaleString("id-ID")}`,
      ];
    });

    grandTotalQty += dayQty;
    grandTotalRevenue += dayRevenue;
    grandTotalProfit += dayProfit;

    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(241, 245, 249);
    doc.rect(14, currentY, 182, 8, "F");
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Tanggal: ${dateStr}`, 18, currentY + 5.5);

    currentY += 10;

    autoTable(doc, {
      startY: currentY,
      head: [["No", "Barcode/QR", "Produk", "Kategori", "Harga", "Qty", "Omset", "Profit"]],
      body: tableRows,
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        textColor: [51, 65, 85],
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "left",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 28 },
        2: { cellWidth: 42 },
        3: { cellWidth: 26 },
        4: { cellWidth: 24, halign: "right" },
        5: { cellWidth: 12, halign: "center" },
        6: { cellWidth: 22, halign: "right" },
        7: { cellWidth: 18, halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 4;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    const subtotalText = `Subtotal ${dateStr}:  Total Item: ${dayQty} pcs  |  Omset: Rp ${dayRevenue.toLocaleString("id-ID")}  |  Profit: Rp ${dayProfit.toLocaleString("id-ID")}`;
    doc.text(subtotalText, 196, currentY, { align: "right" });

    currentY += 8;
  });

  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  currentY += 4;
  doc.setFillColor(15, 23, 42);
  doc.rect(14, currentY, 182, 18, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("GRAND TOTAL REKAPITULASI PENJUALAN", 20, currentY + 7);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Total Terjual: ${grandTotalQty} pcs  |  Total Omset: Rp ${grandTotalRevenue.toLocaleString("id-ID")}  |  Total Profit: Rp ${grandTotalProfit.toLocaleString("id-ID")}`,
    20,
    currentY + 13
  );

  doc.save(`Laporan_Penjualan_${startDate || "Awal"}_to_${endDate || "HariIni"}.pdf`);
}
