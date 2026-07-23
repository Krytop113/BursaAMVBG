import prisma from '@/lib/db';
import { Product, Prisma } from '@prisma/client';

export type { Product };

type DecimalLike = Prisma.Decimal | number | string;

export const productModel = {
    async findById(id: string): Promise<Product | null> {
        return prisma.product.findUnique({ where: { id } });
    },

    async findByQrCode(qrCode: string): Promise<Product | null> {
        return prisma.product.findUnique({ where: { qrCode } });
    },

    async getAllWithCategories() {
        return prisma.product.findMany({
            include: { category: true },
            orderBy: { createdAt: 'asc' },
        });
    },

    async insert(data: Omit<Product, 'createdAt' | 'updatedAt' | 'price' | 'buyPrice'> & { price: DecimalLike; buyPrice: DecimalLike }): Promise<Product> {
        return prisma.product.create({ data });
    },

    async update(id: string, data: Omit<Partial<Product>, 'id' | 'createdAt' | 'updatedAt' | 'price' | 'buyPrice'> & { price?: DecimalLike; buyPrice?: DecimalLike }): Promise<Product> {
        return prisma.product.update({ where: { id }, data });
    },

    async delete(id: string): Promise<Product> {
        return prisma.product.delete({ where: { id } });
    },
};