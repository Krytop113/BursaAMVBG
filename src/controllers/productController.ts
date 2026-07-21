import { NextResponse } from 'next/server';
import { productModel } from "@/models/productModel";
import { validateCreateProduct } from "@/validators/productValidator";
import { saveUploadedImage } from '@/lib/uploadImage';
import { withErrorHandler } from '@/lib/apiHandler';
import { AppError, ConflictError, NotFoundError, ValidationError } from '@/lib/errors';

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
        const products = await productModel.getAllWithCategories();
        return NextResponse.json({
            message: 'Daftar produk berhasil diambil!',
            products: products.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description,
                price: Number(product.price),
                buyPrice: Number(product.buyPrice),
                stock: product.stock,
                qrCode: product.qrCode,
                categoryId: product.categoryId,
                categoryName: product.category.name,
                status: product.stock > 0 ? 'Aktif' : 'Habis',
                imageUrl: product.image_url,
                createdAt: product.createdAt,
            })),
        });
    }),

    createProduct: withErrorHandler('productController.createProduct', async (request: Request): Promise<NextResponse> => {
        const parsedInput = await parseProductRequest(request);

        let qrCode = '';
        let attempts = 0;
        const sanitized = parsedInput.name
            .replace(/[^A-Za-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        while (attempts < 10) {
            const randomNum = Math.floor(10000 + Math.random() * 90000);
            const candidate = sanitized ? `${sanitized}_${randomNum}` : `PROD_${randomNum}`;
            const existing = await productModel.findByQrCode(candidate);
            if (!existing) {
                qrCode = candidate;
                break;
            }
            attempts++;
        }

        if (!qrCode) {
            throw new AppError('Gagal membuat QR Code yang unik.', 500);
        }

        const validation = validateCreateProduct({
            ...parsedInput,
            qrCode,
        });

        if (!validation.success) {
            throw new ValidationError(validation.error, validation.fieldErrors as any);
        }

        const imageUrl = await saveUploadedImage(parsedInput.imageFile);
        const productId = await productModel.getNextProductId(parsedInput.categoryId, parsedInput.price);

        const product = await productModel.insert({
            ...validation.data,
            id: productId,
            qrCode,
            image_url: imageUrl,
        });

        return NextResponse.json(
            { message: 'Produk berhasil ditambahkan!', product },
            { status: 201 }
        );
    }),

    deleteProduct: withErrorHandler('productController.deleteProduct', async (id: string): Promise<NextResponse> => {
        await productModel.delete(id);
        return NextResponse.json(
            { message: 'Produk berhasil dihapus!' },
            { status: 200 }
        );
    }),

    updateProduct: withErrorHandler('productController.updateProduct', async (request: Request, id: string): Promise<NextResponse> => {
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            throw new NotFoundError('Produk tidak ditemukan!');
        }

        const parsedInput = await parseProductRequest(request, {
            name: existingProduct.name,
            description: existingProduct.description,
            price: Number(existingProduct.price),
            buyPrice: Number(existingProduct.buyPrice),
            stock: existingProduct.stock,
            categoryId: existingProduct.categoryId,
        });

        const validation = validateCreateProduct({
            ...parsedInput,
            qrCode: existingProduct.qrCode,
        });

        if (!validation.success) {
            throw new ValidationError(validation.error, validation.fieldErrors as Record<string, string>);
        }

        let imageUrl = existingProduct.image_url;
        if (parsedInput.imageFile && parsedInput.imageFile.size > 0) {
            if (existingProduct.image_url) {
                try {
                    await productModel.deleteImage(id);
                } catch (err) {
                    console.error('Gagal menghapus gambar lama:', err);
                }
            }
            imageUrl = await saveUploadedImage(parsedInput.imageFile);
        }

        const updatedProduct = await productModel.update(id, {
            name: validation.data.name,
            description: validation.data.description,
            price: validation.data.price,
            buyPrice: validation.data.buyPrice,
            stock: validation.data.stock,
            categoryId: validation.data.categoryId,
            image_url: imageUrl,
        });

        return NextResponse.json(
            { message: 'Produk berhasil diperbarui!', product: updatedProduct },
            { status: 200 }
        );
    }),
};