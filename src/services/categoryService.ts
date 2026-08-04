import prisma from '@/lib/db';
import { Category } from '@prisma/client';
import { validateCreateCategory } from '@/validators/categoryValidator';
import { ValidationError } from '@/lib/errors';

export const categoryService = {
    async getAll(): Promise<Category[]> {
        return prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    },

    async create(name: string): Promise<Category> {
        const validation = validateCreateCategory({ name });
        if (!validation.success) {
            throw new ValidationError(validation.error, validation.fieldErrors as Record<string, string>);
        }
        return prisma.category.create({
            data: validation.data,
        });
    },

    async delete(id: number): Promise<void> {
        await prisma.category.delete({
            where: { id },
        });
    },
};

