import { z } from 'zod';

export const loginSchema = z.object({
    identifier: z
        .string({ message: 'Email atau Username wajib diisi!' })
        .min(1, 'Email atau Username tidak boleh kosong!'),
    password: z
        .string({ message: 'Password wajib diisi!' })
        .min(1, 'Password tidak boleh kosong!'),
});

export function validateLogin(data: unknown):
    | { success: true; error: null; data: z.infer<typeof loginSchema> }
    | { success: false; error: string; data: null } {
    const result = loginSchema.safeParse(data);

    if (!result.success) {
        const firstError = result.error.issues[0]?.message || 'Validasi gagal';
        return { success: false, error: firstError, data: null };
    }

    return { success: true, error: null, data: result.data };
}