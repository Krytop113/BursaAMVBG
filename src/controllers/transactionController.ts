import { NextResponse } from 'next/server';
import { transactionModel } from "@/models/transactionModel";
import { validateCreateTransaction } from "@/validators/transactionValidator";
import { MovementType } from '@prisma/client';
import { withErrorHandler } from '@/lib/apiHandler';
import { ValidationError } from '@/lib/errors';

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
            throw new ValidationError(validation.error, validation.fieldErrors as Record<string, string>);
        }

        const transactionResult = await transactionModel.createWithStockUpdate({
            productId: validation.data.productId,
            type: validation.data.type as MovementType,
            quantity: validation.data.quantity,
            note: validation.data.note,
        });

        return NextResponse.json(
            { message: 'Transaksi berhasil ditambahkan!', transaction: transactionResult },
            { status: 201 }
        );
    }),

    deleteTransaction: withErrorHandler('transactionController.deleteTransaction', async (id: string): Promise<NextResponse> => {
        await transactionModel.deleteWithStockUpdate(id);
        return NextResponse.json(
            { message: 'Transaksi berhasil dihapus dan stok produk telah diperbarui!' },
            { status: 200 }
        );
    }),
};
