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
      type: "OUT", // Rekapitulasi penjualan
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

    const items = movements.map((m) => {
      const price = Number(m.product.price);
      const buyPrice = Number(m.product.buyPrice);
      const qty = m.quantity;
      const revenue = price * qty;
      const cost = buyPrice * qty;
      const profit = revenue - cost;

      return {
        id: m.id,
        productId: m.productId,
        productName: m.product.name,
        productQrCode: m.product.qrCode,
        categoryName: m.product.category.name,
        price,
        buyPrice,
        quantity: qty,
        revenue,
        cost,
        profit,
        createdAt: m.createdAt,
      };
    });

    // Ringkasan Statistik
    const summary = items.reduce(
      (acc, curr) => {
        acc.totalRevenue += curr.revenue;
        acc.totalCost += curr.cost;
        acc.totalProfit += curr.profit;
        acc.totalItemsSold += curr.quantity;
        return acc;
      },
      {
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        totalItemsSold: 0,
      }
    );

    return NextResponse.json({
      message: "Data rekapitulasi berhasil diambil!",
      summary,
      items,
    });
  } catch (error) {
    console.error("Error saat mengambil data rekapitulasi:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
