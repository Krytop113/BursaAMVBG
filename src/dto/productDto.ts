import { Product, Category } from '@prisma/client';

export type ProductWithCategory = Product & { category: Category };

export function toProductResponse(product: ProductWithCategory) {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        buyPrice: Number(product.buyPrice),
        stock: product.stock,
        status: product.stock > 0 ? 'Aktif' : 'Habis',
        qrCode: product.qrCode,
        categoryId: product.categoryId,
        categoryName: product.category.name,
        imageUrl: product.image_url,
        createdAt: product.createdAt,
    };
}

export type ProductResponse = ReturnType<typeof toProductResponse>;
