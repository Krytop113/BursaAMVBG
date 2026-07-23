import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const allMovements = await prisma.stockMovement.findMany({
      include: { product: true }
    });

    // 1. Hitung Keuangan dan Statistik Produk
    let totalIncome = 0; // Uang Masuk (OUT * price)
    let totalExpense = 0; // Uang Keluar (IN * buyPrice)

    const productStats: Record<string, { name: string; totalSpent: number; totalEarned: number; profit: number }> = {};

    for (const m of allMovements) {
      const buyPrice = Number(m.product.buyPrice) || 0;
      const price = Number(m.product.price) || 0;
      const qty = m.quantity;

      if (!productStats[m.productId]) {
        productStats[m.productId] = {
          name: m.product.name,
          totalSpent: 0,
          totalEarned: 0,
          profit: 0,
        };
      }

      if (m.type === "IN") {
        const cost = qty * buyPrice;
        totalExpense += cost;
        productStats[m.productId].totalSpent += cost;
      } else if (m.type === "OUT") {
        const revenue = qty * price;
        totalIncome += revenue;
        productStats[m.productId].totalEarned += revenue;
      }
    }

    // Hitung profit bersih per produk
    for (const id in productStats) {
      productStats[id].profit = productStats[id].totalEarned - productStats[id].totalSpent;
    }

    const netProfit = totalIncome - totalExpense;

    // Cari produk pengeluaran terbesar & profit terbesar
    let maxSpentProductId = "";
    let maxSpentValue = 0;
    let maxSpentProductName = "-";

    let maxProfitProductId = "";
    let maxProfitValue = -Infinity;
    let maxProfitProductName = "-";

    for (const id in productStats) {
      const stats = productStats[id];
      if (stats.totalSpent > maxSpentValue) {
        maxSpentValue = stats.totalSpent;
        maxSpentProductId = id;
        maxSpentProductName = stats.name;
      }
      if (stats.profit > maxProfitValue) {
        maxProfitValue = stats.profit;
        maxProfitProductId = id;
        maxProfitProductName = stats.name;
      }
    }

    // Jika tidak ada data transaksi yang profitnya terhitung
    if (maxProfitValue === -Infinity) {
      maxProfitValue = 0;
    }

    // 2. Ambil list produk dengan stok terkecil ke terbesar
    const lowStockProducts = await prisma.product.findMany({
      orderBy: { stock: "asc" },
      take: 5,
      include: { category: true }
    });

    // 3. Mutasi 5 teratas dari produk dengan pengeluaran terbesar dan profit terbesar
    const filterProductIds = Array.from(
      new Set([maxSpentProductId, maxProfitProductId].filter(Boolean))
    );

    let topMutations = [];
    if (filterProductIds.length > 0) {
      topMutations = await prisma.stockMovement.findMany({
        where: {
          productId: { in: filterProductIds }
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { product: true }
      });
    } else {
      // Fallback ke 5 mutasi terbaru jika belum ada penjualan/pembelian spesifik
      topMutations = await prisma.stockMovement.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { product: true }
      });
    }

    // 4. Hitung Penjualan 7 Hari Terakhir
    const salesTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const dayMovements = allMovements.filter(m => {
        const date = new Date(m.createdAt);
        return date >= startOfDay && date <= endOfDay;
      });

      let dayIncome = 0;
      let dayCost = 0;
      for (const m of dayMovements) {
        const qty = m.quantity;
        const buyPrice = Number(m.product.buyPrice) || 0;
        const price = Number(m.product.price) || 0;
        if (m.type === "OUT") {
          dayIncome += qty * price;
          dayCost += qty * buyPrice;
        }
      }

      const dayLabel = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" });

      salesTrend.push({
        label: dayLabel,
        revenue: dayIncome,
        profit: dayIncome - dayCost
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalIncome,
        totalExpense,
        netProfit,
        maxSpentProduct: {
          name: maxSpentProductName,
          value: maxSpentValue
        },
        maxProfitProduct: {
          name: maxProfitProductName,
          value: maxProfitValue
        }
      },
      lowStockProducts: lowStockProducts.map(p => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        price: Number(p.price),
        categoryName: p.category.name
      })),
      topMutations: topMutations.map(t => ({
        id: t.id.slice(0, 8).toUpperCase(),
        productName: t.product.name,
        quantity: t.quantity,
        type: t.type,
        date: new Date(t.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        note: t.note
      })),
      salesTrend
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan internal server.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
