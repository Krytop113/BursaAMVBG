import { NextResponse } from 'next/server';
import { categoryService } from '@/services/categoryService';
import { withErrorHandler } from '@/lib/apiHandler';
import { toCategoryResponse } from '@/dto/categoryDto';

export const GET = withErrorHandler('categories.GET', async (): Promise<NextResponse> => {
    const categories = await categoryService.getAll();
    return NextResponse.json({
        message: 'Daftar kategori berhasil diambil!',
        categories: categories.map(toCategoryResponse),
    });
});

export const POST = withErrorHandler('categories.POST', async (request: Request): Promise<NextResponse> => {
    const body = await request.json();
    const category = await categoryService.create(body.name);
    return NextResponse.json(
        { message: 'Kategori berhasil dibuat!', category: toCategoryResponse(category) },
        { status: 201 }
    );
});