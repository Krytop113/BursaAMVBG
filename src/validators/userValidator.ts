import { z } from 'zod';

export const createUserSchema = z.object({
    username: z
        .string({ message: 'Username wajib diisi!' })
        .min(3, { message: 'Username minimal 3 karakter!' })
        .max(100, { message: 'Username maksimal 100 karakter!' }),
    email: z
        .string({ message: 'Email wajib diisi!' })
        .email({ message: 'Format email tidak valid!' }),
    password: z
        .string({ message: 'Password wajib diisi!' })
        .min(6, { message: 'Password minimal 6 karakter!' }),
    roleId: z
        .number({ message: 'Role ID wajib diisi!' })
        .int({ message: 'Role ID harus berupa bilangan bulat!' }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserFieldErrors = Partial<Record<keyof CreateUserInput, string>>;

export function validateCreateUser(data: unknown):
    | { success: true; error: null; fieldErrors: null; data: CreateUserInput }
    | { success: false; error: string; fieldErrors: UserFieldErrors; data: null } {

    const result = createUserSchema.safeParse(data);

    if (!result.success) {
        const fieldErrors: UserFieldErrors = {};
        for (const issue of result.error.issues) {
            const field = issue.path[0] as keyof CreateUserInput;
            if (field && !fieldErrors[field]) {
                fieldErrors[field] = issue.message;
            }
        }
        const firstError = result.error.issues[0]?.message || 'Validasi gagal.';
        return { success: false, error: firstError, fieldErrors, data: null };
    }
    return { success: true, error: null, fieldErrors: null, data: result.data };
}

export function validateUserForm(raw: {
    username: string;
    email: string;
    password: string;
    roleId: string;
}): UserFieldErrors {
    const parsed = {
        username: raw.username,
        email: raw.email,
        password: raw.password,
        roleId: raw.roleId === '' ? undefined : Number(raw.roleId),
    };

    const result = createUserSchema.safeParse(parsed);
    if (result.success) return {}

    const fieldErrors: UserFieldErrors = {};
    for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateUserInput;
        if (field && !fieldErrors[field]) {
            fieldErrors[field] = issue.message;
        }
    }
    return fieldErrors;
}