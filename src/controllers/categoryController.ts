import { NextResponse } from 'next/server';
import { categoryModel } from "@/models/categoryModel";
import { validateCreateCategory } from "@/validators/categoryValidator";

export const categoryController = {
    async getAllCategories(): Promise<NextResponse> {
        try {
            const categories = await categoryModel.getAll();
            return NextResponse.json({
                message: 'Daftar kategori berhasil diambil!',
                categories: categories.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                })),
            });
        } catch (error) {
            console.error('Error saat mengambil daftar kategori:', error);
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    },

    async createCategory(request: Request): Promise<NextResponse> {
        try {
            const body = await request.json();

            const validation = validateCreateCategory({
                name: body.name,
            })

            if (!validation.success) {
                return NextResponse.json(
                    {
                        error: validation.error,
                        fieldErrors: validation.fieldErrors
                    },
                    { status: 422 }
                );
            }

            const category = await categoryModel.insert(validation.data);
            return NextResponse.json(
                { message: 'Kategori berhasil dibuat!', category },
                { status: 201 }
            );
        } catch (error) {
            console.error('Error saat membuat produk:', error);
            const isPrismaError = typeof error === 'object' && error !== null && 'code' in error;
            if (isPrismaError && (error as any).code === 'P2002') {
                return NextResponse.json(
                    {
                        error: 'Nama kategori sudah digunakan!',
                        fieldErrors: { name: 'Nama kategori sudah digunakan!' },
                    },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    },

    async deleteCategory(id: number): Promise<NextResponse> {
        try{
            await categoryModel.delete(id);
            return NextResponse.json(
                { message: 'Kategori berhasil dihapus!' },
                { status: 200 }
            );
        } catch (error) {
            console.error('Error saat menghapus kategori:', error);
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    }
};