import { NextResponse } from 'next/server';
import { productModel } from "@/models/productModel";
import { validateCreateProduct } from "@/validators/productValidator";

export const productController = {
    async getAllProducts(): Promise<NextResponse> {
        try {
            const products = await productModel.getAllWithCategories();
            return NextResponse.json({
                message: 'Daftar produk berhasil diambil!',
                products: products.map(product => ({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: Number(product.price),
                    stock: product.stock,
                    qrCode: product.qrCode,
                    categoryId: product.categoryId,
                    categoryName: product.category.name,
                    status: product.stock > 0 ? 'Aktif' : 'Habis',
                    createdAt: product.createdAt,
                })),
            });
        } catch (error) {
            console.error('Error saat mengambil daftar produk:', error);
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    },

    async createProduct(request: Request): Promise<NextResponse> {
        try {
            const body = await request.json();

            const validation = validateCreateProduct({
                name: body.name,
                description: body.description,
                price: Number(body.price),
                stock: Number(body.stock),
                qrCode: body.qrCode,
                categoryId: Number(body.categoryId),
            });

            if (!validation.success) {
                return NextResponse.json(
                    {
                        error: validation.error,
                        fieldErrors: validation.fieldErrors,
                    },
                    { status: 422 }
                );
            }

            const product = await productModel.insert(validation.data);

            return NextResponse.json(
                { message: 'Produk berhasil ditambahkan!', product },
                { status: 201 }
            );
        } catch (error: unknown) {
            console.error('Error saat membuat produk:', error);
            const isPrismaError = typeof error === 'object' && error !== null && 'code' in error;
            if (isPrismaError && (error as { code: string }).code === 'P2002') {
                return NextResponse.json(
                    {
                        error: 'QR Code sudah digunakan oleh produk lain.',
                        fieldErrors: { qrCode: 'QR Code sudah digunakan oleh produk lain.' },
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

    async deleteProduct(id: number): Promise<NextResponse> {
        try {
            await productModel.delete(id);
            return NextResponse.json(
                { message: 'Produk berhasil dihapus!' },
                { status: 200 }
            );
        } catch (error) {
            console.error('Error saat menghapus produk:', error);
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    },
};