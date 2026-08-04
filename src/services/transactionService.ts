import prisma from '@/lib/db';
import { StockMovement, MovementType } from '@prisma/client';
import { BadRequestError, NotFoundError } from '@/lib/errors';
import { StockMovementWithProduct } from '@/dto/transactionDto';

export type CreateTransactionInput = {
    productId: string;
    type: MovementType;
    quantity: number;
    note?: string;
};

export const transactionService = {
    async getAll(): Promise<StockMovementWithProduct[]> {
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
        }) as Promise<StockMovementWithProduct[]>;
    },

    async create(input: CreateTransactionInput): Promise<StockMovement> {
        return prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({ where: { id: input.productId } });
            if (!product) throw new NotFoundError('Produk tidak ditemukan.');

            let newStock = product.stock;
            if (input.type === MovementType.IN) {
                newStock += input.quantity;
            } else if (input.type === MovementType.OUT) {
                if (product.stock < input.quantity) {
                    throw new BadRequestError('Stok produk tidak mencukupi untuk transaksi keluar.');
                }
                newStock -= input.quantity;
            }

            await tx.product.update({ where: { id: input.productId }, data: { stock: newStock } });
            return tx.stockMovement.create({
                data: {
                    productId: input.productId,
                    type: input.type,
                    quantity: input.quantity,
                    note: input.note || '',
                },
            });
        });
    },

    async delete(id: string): Promise<void> {
        await prisma.$transaction(async (tx) => {
            const movement = await tx.stockMovement.findUnique({ where: { id } });
            if (!movement) throw new NotFoundError('Transaksi tidak ditemukan.');

            const product = await tx.product.findUnique({ where: { id: movement.productId } });
            if (!product) throw new NotFoundError('Produk terkait tidak ditemukan.');

            let newStock = product.stock;
            if (movement.type === MovementType.IN) {
                if (product.stock < movement.quantity) {
                    throw new BadRequestError(
                        'Gagal menghapus transaksi. Stok produk saat ini lebih kecil daripada jumlah transaksi masuk yang ingin dibatalkan.'
                    );
                }
                newStock -= movement.quantity;
            } else if (movement.type === MovementType.OUT) {
                newStock += movement.quantity;
            }

            await tx.product.update({ where: { id: movement.productId }, data: { stock: newStock } });
            await tx.stockMovement.delete({ where: { id } });
        });
    },
};

