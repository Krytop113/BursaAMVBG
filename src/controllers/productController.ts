import { NextResponse } from 'next/server';
import { productService } from '@/services/productService';
import { withErrorHandler } from '@/lib/apiHandler';
import { toProductResponse } from '@/dto/productDto';

interface ParsedProductInput {
    name: string;
    description: string;
    price: number;
    buyPrice: number;
    stock: number;
    categoryId: number;
    imageFile: File | null;
}

async function parseProductRequest(request: Request, defaults: Partial<ParsedProductInput> = {}): Promise<ParsedProductInput> {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        return {
            name: formData.has('name') ? (formData.get('name') as string) || '' : defaults.name ?? '',
            description: formData.has('description') ? (formData.get('description') as string) || '' : defaults.description ?? '',
            price: formData.has('price') ? Number(formData.get('price') || 0) : defaults.price ?? 0,
            buyPrice: formData.has('buyPrice') ? Number(formData.get('buyPrice') || 0) : defaults.buyPrice ?? 0,
            stock: formData.has('stock') ? Number(formData.get('stock') || 0) : defaults.stock ?? 0,
            categoryId: formData.has('categoryId') ? Number(formData.get('categoryId') || 0) : defaults.categoryId ?? 0,
            imageFile: formData.get('image') as File | null,
        };
    }

    const body = await request.json().catch(() => ({}));
    return {
        name: body.name !== undefined ? body.name : defaults.name ?? '',
        description: body.description !== undefined ? body.description : defaults.description ?? '',
        price: body.price !== undefined ? Number(body.price) : defaults.price ?? 0,
        buyPrice: body.buyPrice !== undefined ? Number(body.buyPrice) : defaults.buyPrice ?? 0,
        stock: body.stock !== undefined ? Number(body.stock) : defaults.stock ?? 0,
        categoryId: body.categoryId !== undefined ? Number(body.categoryId) : defaults.categoryId ?? 0,
        imageFile: null,
    };
}

export const productController = {
    getAllProducts: withErrorHandler('productController.getAllProducts', async (): Promise<NextResponse> => {
        const products = await productService.getAll();
        return NextResponse.json({
            message: 'Daftar produk berhasil diambil!',
            products: products.map(toProductResponse),
        });
    }),

    createProduct: withErrorHandler('productController.createProduct', async (request: Request): Promise<NextResponse> => {
        const input = await parseProductRequest(request);
        const product = await productService.create(input);
        return NextResponse.json(
            { message: 'Produk berhasil ditambahkan!', product },
            { status: 201 }
        );
    }),

    updateProduct: withErrorHandler('productController.updateProduct', async (request: Request, id: string): Promise<NextResponse> => {
        const input = await parseProductRequest(request);
        const product = await productService.update(id, input);
        return NextResponse.json(
            { message: 'Produk berhasil diperbarui!', product },
            { status: 200 }
        );
    }),

    deleteProduct: withErrorHandler('productController.deleteProduct', async (id: string): Promise<NextResponse> => {
        await productService.delete(id);
        return NextResponse.json(
            { message: 'Produk berhasil dihapus!' },
            { status: 200 }
        );
    }),
};