import prisma from '@/lib/db';
import { transactionModel } from '@/models/transactionModel';
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
        return transactionModel.getAllWithProducts() as Promise<StockMovementWithProduct[]>;
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
            return transactionModel.insert(input, tx);
        });
    },

    async delete(id: string): Promise<void> {
        await prisma.$transaction(async (tx) => {
            const movement = await transactionModel.findById(id, tx);
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
            await transactionModel.delete(id, tx);
        });
    },
};
