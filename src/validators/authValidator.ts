import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string({ message: 'Email wajib diisi!' })
        .min(1, 'Email tidak boleh kosong!')
        .email('Format email tidak valid!'),
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