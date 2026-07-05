import prisma from '@/lib/db';
import { Category } from '@prisma/client';

export type { Category };

export const categoryModel = {
    async getAll(): Promise<Category[]> {
        return prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    },

    async findById(id: number): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { id },
        });
    },

    async insert(data: Omit<Category, 'id'>): Promise<Category> {
        return prisma.category.create({
            data,
        });
    },

    async delete(id: number): Promise<Category> {
        return prisma.category.delete({
            where: { id },
        });
    },
};