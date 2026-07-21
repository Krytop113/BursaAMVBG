import { NextResponse } from 'next/server';
import { categoryService } from '@/services/categoryService';
import { withErrorHandler } from '@/lib/apiHandler';
import { toCategoryResponse } from '@/dto/categoryDto';

export const categoryController = {
    getAllCategories: withErrorHandler('categoryController.getAllCategories', async (): Promise<NextResponse> => {
        const categories = await categoryService.getAll();
        return NextResponse.json({
            message: 'Daftar kategori berhasil diambil!',
            categories: categories.map(toCategoryResponse),
        });
    }),

    createCategory: withErrorHandler('categoryController.createCategory', async (request: Request): Promise<NextResponse> => {
        const body = await request.json();
        const category = await categoryService.create(body.name);
        return NextResponse.json(
            { message: 'Kategori berhasil dibuat!', category: toCategoryResponse(category) },
            { status: 201 }
        );
    }),

    deleteCategory: withErrorHandler('categoryController.deleteCategory', async (id: number): Promise<NextResponse> => {
        await categoryService.delete(id);
        return NextResponse.json(
            { message: 'Kategori berhasil dihapus!' },
            { status: 200 }
        );
    }),
};