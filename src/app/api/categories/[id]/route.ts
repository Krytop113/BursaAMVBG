import { NextResponse } from 'next/server';
import { categoryService } from '@/services/categoryService';
import { withErrorHandler } from '@/lib/apiHandler';

export const DELETE = withErrorHandler('categories.DELETE', async (
    request: Request,
    context?: unknown
): Promise<NextResponse> => {
    const { params } = context as { params: Promise<{ id: string }> };
    const resolvedParams = await params;
    const categoryId = parseInt(resolvedParams.id, 10);
    await categoryService.delete(categoryId);
    return NextResponse.json(
        { message: 'Kategori berhasil dihapus!' },
        { status: 200 }
    );
});

