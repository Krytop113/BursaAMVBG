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

import { parseZodErrors, parseZodResult } from '@/lib/parseZodErrors';

export function validateCreateTransaction(data: unknown) {
    return parseZodResult<CreateTransactionInput, typeof createTransactionSchema>(createTransactionSchema, data);
}

export function validateTransactionForm(raw: {
    productId: string;
    type: 'IN' | 'OUT';
    quantity: number;
    note: string;
}): TransactionFieldErrors {
    const result = createTransactionSchema.safeParse(raw);
    if (result.success) return {};

    return parseZodErrors<CreateTransactionInput>(result.error);
}

