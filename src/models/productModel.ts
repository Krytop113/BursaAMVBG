import prisma from '@/lib/db';
import { Product } from '@prisma/client';

export type { Product };

export const productModel = {
    async findById(id: number): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { id },
        });
    },

    async getAllWithCategories(): Promise<Product[]> {
        return prisma.product.findMany({
            include: {
                category: true,
            },
            orderBy: { createdAt: 'asc' },
        });
    },

    async insert(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
        return prisma.product.create({
            data,
        });
    },

    async update(id: number, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> {
        return prisma.product.update({
            where: { id },
            data,
        });
    },

    async delete(id: number): Promise<Product> {
        return prisma.product.delete({
            where: { id },
        });
    },
};