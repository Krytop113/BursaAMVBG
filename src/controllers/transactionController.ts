import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { transactionModel } from "@/models/transactionModel";
import { validateCreateTransaction } from "@/validators/transactionValidator";
import { MovementType } from '@prisma/client';
import { withErrorHandler } from '@/lib/apiHandler';
import { BadRequestError, NotFoundError, ValidationError } from '@/lib/errors';

export const transactionController = {
    getAllTransactions: withErrorHandler('transactionController.getAllTransactions', async (): Promise<NextResponse> => {
        const movements = await transactionModel.getAllWithProducts();
        return NextResponse.json({
            message: 'Daftar transaksi berhasil diambil!',
            transactions: movements.map(m => ({
                id: m.id,
                productId: m.productId,
                productName: m.product.name,
                productQrCode: m.product.qrCode,
                productPrice: Number(m.product.price),
                productBuyPrice: Number(m.product.buyPrice),
                type: m.type,
                quantity: m.quantity,
                note: m.note,
                createdAt: m.createdAt,
            })),
        });
    }),

    createTransaction: withErrorHandler('transactionController.createTransaction', async (request: Request): Promise<NextResponse> => {
        const body = await request.json();
        
        if (body.quantity !== undefined) {
            body.quantity = Number(body.quantity);
        }

        const validation = validateCreateTransaction(body);

        if (!validation.success) {
            throw new ValidationError(validation.error, validation.fieldErrors as any);
        }

        const transactionResult = await prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
                where: { id: validation.data.productId },
            });

            if (!product) {
                throw new NotFoundError('Produk tidak ditemukan.');
            }

            let newStock = product.stock;
            if (validation.data.type === MovementType.IN) {
                newStock += validation.data.quantity;
            } else if (validation.data.type === MovementType.OUT) {
                if (product.stock < validation.data.quantity) {
                    throw new BadRequestError('Stok produk tidak mencukupi untuk transaksi keluar.');
                }
                newStock -= validation.data.quantity;
            }

            // Update product stock
            await tx.product.update({
                where: { id: validation.data.productId },
                data: { stock: newStock },
            });

            // Create stock movement in the transaction
            return transactionModel.insert({
                productId: validation.data.productId,
                type: validation.data.type as MovementType,
                quantity: validation.data.quantity,
                note: validation.data.note,
            }, tx);
        });

        return NextResponse.json(
            { message: 'Transaksi berhasil ditambahkan!', transaction: transactionResult },
            { status: 201 }
        );
    }),

    deleteTransaction: withErrorHandler('transactionController.deleteTransaction', async (id: string): Promise<NextResponse> => {
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

            // Update product stock
            await tx.product.update({
                where: { id: movement.productId },
                data: { stock: newStock },
            });

            // Delete stock movement in the transaction
            await transactionModel.delete(id, tx);
        });

        return NextResponse.json(
            { message: 'Transaksi berhasil dihapus dan stok produk telah diperbarui!' },
            { status: 200 }
        );
    }),
};
