import { saveUploadedImage, deleteUploadedImage } from '@/lib/uploadImage';
import { validateCreateProduct } from '@/validators/productValidator';
import { AppError, NotFoundError, ValidationError } from '@/lib/errors';
import { ProductWithCategory } from '@/dto/productDto';
import prisma from '@/lib/db';
import { Product } from '@prisma/client';

export interface ProductRequestInput {
    name: string;
    description: string;
    price: number;
    buyPrice: number;
    stock: number;
    categoryId: number;
    imageFile: File | null;
}

async function generateUniqueQrCode(name: string): Promise<string> {
    const sanitized = name
        .replace(/[^A-Za-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    for (let attempts = 0; attempts < 10; attempts++) {
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const candidate = sanitized ? `${sanitized}_${randomNum}` : `PROD_${randomNum}`;
        const existing = await prisma.product.findUnique({ where: { qrCode: candidate } });
        if (!existing) return candidate;
    }

    throw new AppError('Gagal membuat QR Code yang unik.', 500);
}

async function generateProductId(categoryId: number, price: number): Promise<string> {
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { name: true },
    });
    const categoryCode = category ? category.name.substring(0, 2).toUpperCase() : 'PR';

    const priceStr = String(price).replace(/[^0-9]/g, '');
    const priceCode = priceStr.substring(0, 2).padEnd(2, '0');

    const products = await prisma.product.findMany({ select: { id: true } });

    let maxNum = 0;
    for (const p of products) {
        const parts = p.id.split('-');
        const lastPart = parts[parts.length - 1];
        if (lastPart) {
            const num = parseInt(lastPart, 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        }
    }

    const seqCode = String(maxNum + 1).padStart(3, '0');
    return `${categoryCode}-${priceCode}-${seqCode}`;
}

export const productService = {
    async getAll(): Promise<ProductWithCategory[]> {
        return prisma.product.findMany({
            include: { category: true },
            orderBy: { createdAt: 'asc' },
        });
    },

    async create(input: ProductRequestInput): Promise<Product> {
        const qrCode = await generateUniqueQrCode(input.name);

        const validation = validateCreateProduct({ ...input, qrCode });
        if (!validation.success) {
            throw new ValidationError(validation.error, validation.fieldErrors as Record<string, string>);
        }

        const imageUrl = await saveUploadedImage(input.imageFile);
        const productId = await generateProductId(input.categoryId, input.price);

        return prisma.product.create({
            data: {
                ...validation.data,
                id: productId,
                qrCode,
                image_url: imageUrl,
            },
        });
    },

    async update(id: string, input: ProductRequestInput): Promise<Product> {
        const existingProduct = await prisma.product.findUnique({ where: { id } });
        if (!existingProduct) throw new NotFoundError('Produk tidak ditemukan!');

        const validation = validateCreateProduct({ ...input, qrCode: existingProduct.qrCode });
        if (!validation.success) {
            throw new ValidationError(validation.error, validation.fieldErrors as Record<string, string>);
        }

        let imageUrl = existingProduct.image_url;
        if (input.imageFile && input.imageFile.size > 0) {
            if (existingProduct.image_url) {
                try {
                    await deleteUploadedImage(existingProduct.image_url);
                } catch (err) {
                    console.error('Gagal menghapus gambar lama dari Supabase Storage:', err);
                }
            }
            imageUrl = await saveUploadedImage(input.imageFile);
        }

        return prisma.product.update({
            where: { id },
            data: {
                name: validation.data.name,
                description: validation.data.description,
                price: validation.data.price,
                buyPrice: validation.data.buyPrice,
                stock: validation.data.stock,
                categoryId: validation.data.categoryId,
                image_url: imageUrl,
            },
        });
    },

    async delete(id: string): Promise<void> {
        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) throw new NotFoundError('Produk tidak ditemukan!');

        if (existing.image_url) {
            try {
                await deleteUploadedImage(existing.image_url);
            } catch (err) {
                console.error('Gagal menghapus file gambar dari Supabase Storage saat menghapus produk:', err);
            }
        }

        await prisma.product.delete({ where: { id } });
    },
};

