import { categoryModel, Category } from '@/models/categoryModel';
import { validateCreateCategory } from '@/validators/categoryValidator';
import { ValidationError } from '@/lib/errors';

export const categoryService = {
    async getAll(): Promise<Category[]> {
        return categoryModel.getAll();
    },

    async create(name: string): Promise<Category> {
        const validation = validateCreateCategory({ name });
        if (!validation.success) {
            throw new ValidationError(validation.error, validation.fieldErrors as Record<string, string>);
        }
        return categoryModel.insert(validation.data);
    },

    async delete(id: number): Promise<void> {
        await categoryModel.delete(id);
    },
};
