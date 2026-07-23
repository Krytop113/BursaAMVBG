import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z
        .string({ message: 'Nama kategori wajib diisi!' })
        .min(3, 'Nama kategori minimal 3 karakter!')
        .max(100, 'Nama kategori maksimal 100 karakter!'),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CategoryFieldErrors = Partial<Record<keyof CreateCategoryInput, string>>;

import { parseZodErrors, parseZodResult } from '@/lib/parseZodErrors';

export function validateCreateCategory(data: unknown) {
    return parseZodResult<CreateCategoryInput, typeof createCategorySchema>(createCategorySchema, data);
}

export function validateCategoryForm(raw: {
    name: string;
}): CategoryFieldErrors {
    const parsed = {
        name: raw.name,
    };

    const result = createCategorySchema.safeParse(parsed);
    if (result.success) return {};

    return parseZodErrors<CreateCategoryInput>(result.error);
}