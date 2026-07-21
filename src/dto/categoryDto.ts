import { Category } from '@prisma/client';

export function toCategoryResponse(category: Category) {
    return {
        id: category.id,
        name: category.name,
    };
}

export type CategoryResponse = ReturnType<typeof toCategoryResponse>;
