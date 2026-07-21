import { NextResponse } from 'next/server';
import { categoryModel } from "@/models/categoryModel";
import { validateCreateCategory } from "@/validators/categoryValidator";
import { withErrorHandler } from '@/lib/apiHandler';
import { ValidationError } from '@/lib/errors';

export const categoryController = {
    getAllCategories: withErrorHandler('categoryController.getAllCategories', async (): Promise<NextResponse> => {
        const categories = await categoryModel.getAll();
        return NextResponse.json({
            message: 'Daftar kategori berhasil diambil!',
            categories: categories.map(cat => ({
                id: cat.id,
                name: cat.name,
            })),
        });
    }),

    createCategory: withErrorHandler('categoryController.createCategory', async (request: Request): Promise<NextResponse> => {
        const body = await request.json();

        const validation = validateCreateCategory({
            name: body.name,
        });

        if (!validation.success) {
            throw new ValidationError(validation.error, validation.fieldErrors as any);
        }

        const category = await categoryModel.insert(validation.data);
        return NextResponse.json(
            { message: 'Kategori berhasil dibuat!', category },
            { status: 201 }
        );
    }),

    deleteCategory: withErrorHandler('categoryController.deleteCategory', async (id: number): Promise<NextResponse> => {
        await categoryModel.delete(id);
        return NextResponse.json(
            { message: 'Kategori berhasil dihapus!' },
            { status: 200 }
        );
    })
};