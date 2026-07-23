import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const categoryId = searchParams.get("categoryId");
    const productId = searchParams.get("productId");

    const where: any = {
      type: "OUT",
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(`${startDate}T00:00:00.000Z`);
      }
      if (endDate) {
        where.createdAt.lte = new Date(`${endDate}T23:59:59.999Z`);
      }
    }

    if (categoryId) {
      where.product = where.product || {};
      where.product.categoryId = parseInt(categoryId, 10);
    }

    if (productId) {
      where.productId = productId;
    }

    const movements = await prisma.stockMovement.findMany({
      where,
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Generate CSV Content
    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel to display characters correctly
    csvContent += "ID Transaksi,Tanggal,Nama Produk,Barcode/QR,Kategori,Harga Beli (Modal),Harga Jual,Kuantitas Terjual,Total Jual (Omset),Keuntungan\n";

    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    let totalItems = 0;

    movements.forEach((m) => {
      const price = Number(m.product.price);
      const buyPrice = Number(m.product.buyPrice);
      const qty = m.quantity;
      const revenue = price * qty;
      const cost = buyPrice * qty;
      const profit = revenue - cost;

      totalRevenue += revenue;
      totalCost += cost;
      totalProfit += profit;
      totalItems += qty;

      const dateStr = new Date(m.createdAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      // Escape quotes and commas in product and category names
      const escapedProdName = `"${m.product.name.replace(/"/g, '""')}"`;
      const escapedCatName = `"${m.product.category.name.replace(/"/g, '""')}"`;

      csvContent += `${m.id},${dateStr},${escapedProdName},${m.product.qrCode},${escapedCatName},${buyPrice},${price},${qty},${revenue},${profit}\n`;
    });

    // Summary footer row
    csvContent += `\nTOTAL,,,,-,${totalCost},-,${totalItems},${totalRevenue},${totalProfit}\n`;

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="rekap_penjualan_${startDate || "all"}_to_${endDate || "all"}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error saat export CSV:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses ekspor berkas." },
      { status: 500 }
    );
  }
}
