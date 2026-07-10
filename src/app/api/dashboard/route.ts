import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const [totalRevenueResult, totalTransactions, totalProducts, latestTransactions] = await Promise.all([
      prisma.stockMovement.aggregate({
        where: { type: "OUT" },
        _sum: { quantity: true } 
      }),
      prisma.stockMovement.count(),
      prisma.product.count(),
      prisma.stockMovement.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { product: true }
      })
    ]);

    const movementsOut = await prisma.stockMovement.findMany({
      where: { type: "OUT" },
      include: { product: true }
    });
    const estimatedRevenue = movementsOut.reduce((acc, current) => {
      return acc + (current.quantity * Number(current.product.price));
    }, 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue: `Rp ${estimatedRevenue.toLocaleString("id-ID")}`,
        totalTransactions,
        totalProducts,
        conversionRate: "4.8%"
      },
      latestTransactions: latestTransactions.map(t => ({
        id: t.id.slice(0, 8).toUpperCase(),
        productName: t.product.name,
        quantity: t.quantity,
        type: t.type,
        date: new Date(t.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        note: t.note
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
