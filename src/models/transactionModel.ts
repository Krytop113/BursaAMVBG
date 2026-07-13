import prisma from '@/lib/db';
import { StockMovement, MovementType } from '@prisma/client';

export type { StockMovement };

export const transactionModel = {
    async getAllWithProducts() {
        return prisma.stockMovement.findMany({
            include: {
                product: {
                    select: {
                        name: true,
                        qrCode: true,
                        price: true,
                        buyPrice: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    async findById(id: string, tx?: any) {
        const client = tx || prisma;
        return client.stockMovement.findUnique({
            where: { id },
        });
    },

    async insert(data: { productId: string; type: MovementType; quantity: number; note: string }, tx?: any): Promise<StockMovement> {
        const client = tx || prisma;
        return client.stockMovement.create({
            data,
        });
    },

    async delete(id: string, tx?: any): Promise<StockMovement> {
        const client = tx || prisma;
        return client.stockMovement.delete({
            where: { id },
        });
    },
};
