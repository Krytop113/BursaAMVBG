import prisma from '@/lib/db';
import { StockMovement, MovementType, Prisma } from '@prisma/client';

export type { StockMovement };

export type TransactionClient = Prisma.TransactionClient;

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
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    async findById(id: string, tx?: TransactionClient) {
        const client = tx || prisma;
        return client.stockMovement.findUnique({ where: { id } });
    },

    async insert(
        data: { productId: string; type: MovementType; quantity: number; note?: string },
        tx?: TransactionClient
    ): Promise<StockMovement> {
        const client = tx || prisma;
        return client.stockMovement.create({
            data: {
                productId: data.productId,
                type: data.type,
                quantity: data.quantity,
                note: data.note || '',
            },
        });
    },

    async delete(id: string, tx?: TransactionClient): Promise<StockMovement> {
        const client = tx || prisma;
        return client.stockMovement.delete({ where: { id } });
    },
};
