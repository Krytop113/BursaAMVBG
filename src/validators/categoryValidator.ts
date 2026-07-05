import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z
        .string({ message: 'Nama kategori wajib diisi!' })
        .min(3, 'Nama kategori minimal 3 karakter!')
        .max(100, 'Nama kategori maksimal 100 karakter!'),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CategoryFieldErrors = Partial<Record<keyof CreateCategoryInput, string>>;

export function validateCreateCategory(data: unknown):
    | { success: true; error: null; fieldErrors: null; data: CreateCategoryInput }
    | { success: false; error: string; fieldErrors: CategoryFieldErrors; data: null } {

    const result = createCategorySchema.safeParse(data);

    if (!result.success) {
        const fieldErrors: CategoryFieldErrors = {};
        for (const issue of result.error.issues) {
            const field = issue.path[0] as keyof CreateCategoryInput;
            if (field && !fieldErrors[field]) {
                fieldErrors[field] = issue.message;
            }
        }
        const firstError = result.error.issues[0]?.message || 'Validasi gagal.';
        return { success: false, error: firstError, fieldErrors, data: null };
    }

    return { success: true, error: null, fieldErrors: null, data: result.data };
}

export function validateCategoryForm(raw: {
    name: string;
}): CategoryFieldErrors {
    const parsed = {
        name: raw.name,
    };

    const result = createCategorySchema.safeParse(parsed);
    if (result.success) return {};

    const fieldErrors: CategoryFieldErrors = {};
    for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateCategoryInput;
        if (field && !fieldErrors[field]) {
            fieldErrors[field] = issue.message;
        }
    }
    return fieldErrors;
}