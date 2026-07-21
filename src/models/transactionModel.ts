import prisma from '@/lib/db';
import { StockMovement, MovementType, Prisma } from '@prisma/client';
import { BadRequestError, NotFoundError } from '@/lib/errors';

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
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    async findById(id: string, tx?: TransactionClient) {
        const client = tx || prisma;
        return client.stockMovement.findUnique({
            where: { id },
        });
    },

    async insert(data: { productId: string; type: MovementType; quantity: number; note?: string }, tx?: TransactionClient): Promise<StockMovement> {
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
        return client.stockMovement.delete({
            where: { id },
        });
    },

    async createWithStockUpdate(data: { productId: string; type: MovementType; quantity: number; note?: string }): Promise<StockMovement> {
        return prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
                where: { id: data.productId },
            });

            if (!product) {
                throw new NotFoundError('Produk tidak ditemukan.');
            }

            let newStock = product.stock;
            if (data.type === MovementType.IN) {
                newStock += data.quantity;
            } else if (data.type === MovementType.OUT) {
                if (product.stock < data.quantity) {
                    throw new BadRequestError('Stok produk tidak mencukupi untuk transaksi keluar.');
                }
                newStock -= data.quantity;
            }

            await tx.product.update({
                where: { id: data.productId },
                data: { stock: newStock },
            });

            return transactionModel.insert(data, tx);
        });
    },

    async deleteWithStockUpdate(id: string): Promise<void> {
        await prisma.$transaction(async (tx) => {
            const movement = await transactionModel.findById(id, tx);

            if (!movement) {
                throw new NotFoundError('Transaksi tidak ditemukan.');
            }

            const product = await tx.product.findUnique({
                where: { id: movement.productId },
            });

            if (!product) {
                throw new NotFoundError('Produk terkait tidak ditemukan.');
            }

            let newStock = product.stock;
            if (movement.type === MovementType.IN) {
                if (product.stock < movement.quantity) {
                    throw new BadRequestError('Gagal menghapus transaksi. Stok produk saat ini lebih kecil daripada jumlah transaksi masuk yang ingin dibatalkan.');
                }
                newStock -= movement.quantity;
            } else if (movement.type === MovementType.OUT) {
                newStock += movement.quantity;
            }

            await tx.product.update({
                where: { id: movement.productId },
                data: { stock: newStock },
            });

            await transactionModel.delete(id, tx);
        });
    },
};
