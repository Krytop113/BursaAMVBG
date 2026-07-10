import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { transactionModel } from "@/models/transactionModel";
import { validateCreateTransaction } from "@/validators/transactionValidator";
import { MovementType } from '@prisma/client';

export const transactionController = {
    async getAllTransactions(): Promise<NextResponse> {
        try {
            const movements = await transactionModel.getAllWithProducts();
            return NextResponse.json({
                message: 'Daftar transaksi berhasil diambil!',
                transactions: movements.map(m => ({
                    id: m.id,
                    productId: m.productId,
                    productName: m.product.name,
                    productQrCode: m.product.qrCode,
                    type: m.type,
                    quantity: m.quantity,
                    note: m.note,
                    createdAt: m.createdAt,
                })),
            });
        } catch (error) {
            console.error('Error saat mengambil daftar transaksi:', error);
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    },

    async createTransaction(request: Request): Promise<NextResponse> {
        try {
            const body = await request.json();
            
            if (body.quantity !== undefined) {
                body.quantity = Number(body.quantity);
            }

            const validation = validateCreateTransaction(body);

            if (!validation.success) {
                return NextResponse.json(
                    {
                        error: validation.error,
                        fieldErrors: validation.fieldErrors,
                    },
                    { status: 422 }
                );
            }

            const transactionResult = await prisma.$transaction(async (tx) => {
                const product = await tx.product.findUnique({
                    where: { id: validation.data.productId },
                });

                if (!product) {
                    throw new Error('Produk tidak ditemukan.');
                }

                let newStock = product.stock;
                if (validation.data.type === MovementType.IN) {
                    newStock += validation.data.quantity;
                } else if (validation.data.type === MovementType.OUT) {
                    if (product.stock < validation.data.quantity) {
                        throw new Error('Stok produk tidak mencukupi untuk transaksi keluar.');
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
        } catch (error: any) {
            console.error('Error saat membuat transaksi:', error);
            return NextResponse.json(
                { error: error.message || 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    },

    async deleteTransaction(id: string): Promise<NextResponse> {
        try {
            await prisma.$transaction(async (tx) => {
                const movement = await transactionModel.findById(id, tx);

                if (!movement) {
                    throw new Error('Transaksi tidak ditemukan.');
                }

                const product = await tx.product.findUnique({
                    where: { id: movement.productId },
                });

                if (!product) {
                    throw new Error('Produk terkait tidak ditemukan.');
                }

                let newStock = product.stock;
                if (movement.type === MovementType.IN) {
                    if (product.stock < movement.quantity) {
                        throw new Error('Gagal menghapus transaksi. Stok produk saat ini lebih kecil daripada jumlah transaksi masuk yang ingin dibatalkan.');
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
        } catch (error: any) {
            console.error('Error saat menghapus transaksi:', error);
            return NextResponse.json(
                { error: error.message || 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    },
};
