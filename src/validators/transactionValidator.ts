import { z } from 'zod';

export const createTransactionSchema = z.object({
    productId: z
        .string({ message: 'Produk wajib dipilih!' })
        .min(1, 'Produk wajib dipilih!'),
    type: z.enum(['IN', 'OUT']),
    quantity: z
        .number({ message: 'Jumlah wajib diisi!' })
        .int('Jumlah harus berupa bilangan bulat!')
        .min(1, 'Jumlah minimal adalah 1!'),
    note: z
        .string()
        .max(500, 'Catatan maksimal 500 karakter!')
        .optional()
        .default(''),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type TransactionFieldErrors = Partial<Record<keyof CreateTransactionInput, string>>;

export function validateCreateTransaction(data: unknown):
    | { success: true; error: null; fieldErrors: null; data: CreateTransactionInput }
    | { success: false; error: string; fieldErrors: TransactionFieldErrors; data: null } {

    const result = createTransactionSchema.safeParse(data);

    if (!result.success) {
        const fieldErrors: TransactionFieldErrors = {};
        for (const issue of result.error.issues) {
            const field = issue.path[0] as keyof CreateTransactionInput;
            if (field && !fieldErrors[field]) {
                fieldErrors[field] = issue.message;
            }
        }
        const firstError = result.error.issues[0]?.message || 'Validasi gagal.';
        return { success: false, error: firstError, fieldErrors, data: null };
    }

    return { success: true, error: null, fieldErrors: null, data: result.data };
}

export function validateTransactionForm(raw: {
    productId: string;
    type: 'IN' | 'OUT';
    quantity: number;
    note: string;
}): TransactionFieldErrors {
    const result = createTransactionSchema.safeParse(raw);
    if (result.success) return {};

    const fieldErrors: TransactionFieldErrors = {};
    for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateTransactionInput;
        if (field && !fieldErrors[field]) {
            fieldErrors[field] = issue.message;
        }
    }
    return fieldErrors;
}
