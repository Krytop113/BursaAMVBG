import { NextResponse } from 'next/server';
import { transactionService } from '@/services/transactionService';
import { withErrorHandler } from '@/lib/apiHandler';

export const DELETE = withErrorHandler('transactions.DELETE', async (
    request: Request,
    context?: unknown
): Promise<NextResponse> => {
    const { params } = context as { params: Promise<{ id: string }> };
    const resolvedParams = await params;
    await transactionService.delete(resolvedParams.id);
    return NextResponse.json(
        { message: 'Transaksi berhasil dihapus dan stok produk telah diperbarui!' },
        { status: 200 }
    );
});

