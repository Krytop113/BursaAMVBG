import { NextResponse } from 'next/server';
import { transactionService } from '@/services/transactionService';
import { validateCreateTransaction } from '@/validators/transactionValidator';
import { withErrorHandler } from '@/lib/apiHandler';
import { ValidationError } from '@/lib/errors';
import { toTransactionResponse } from '@/dto/transactionDto';
import { MovementType } from '@prisma/client';

export const GET = withErrorHandler('transactions.GET', async (): Promise<NextResponse> => {
    const movements = await transactionService.getAll();
    return NextResponse.json({
        message: 'Daftar transaksi berhasil diambil!',
        transactions: movements.map(toTransactionResponse),
    });
});

export const POST = withErrorHandler('transactions.POST', async (request: Request): Promise<NextResponse> => {
    const body = await request.json();

    if (body.quantity !== undefined) body.quantity = Number(body.quantity);

    const validation = validateCreateTransaction(body);
    if (!validation.success) {
        throw new ValidationError(validation.error, validation.fieldErrors as Record<string, string>);
    }

    const transaction = await transactionService.create({
        productId: validation.data.productId,
        type: validation.data.type as MovementType,
        quantity: validation.data.quantity,
        note: validation.data.note,
    });

    return NextResponse.json(
        { message: 'Transaksi berhasil ditambahkan!', transaction },
        { status: 201 }
    );
});

