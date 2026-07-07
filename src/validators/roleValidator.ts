import { z } from 'zod';

export const createRoleSchema = z.object({
    name: z
        .string({ message: 'Nama role wajib diisi!' })
        .min(3, 'Nama role minimal 3 karakter!')
        .max(100, 'Nama role maksimal 100 karakter!'),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type RoleFieldErrors = Partial<Record<keyof CreateRoleInput, string>>;

export function validateCreateRole(data: unknown):
    | { success: true; error: null; fieldErrors: null; data: CreateRoleInput }
    | { success: false; error: string; fieldErrors: RoleFieldErrors; data: null } {

    const result = createRoleSchema.safeParse(data);

    if (!result.success) {
        const fieldErrors: RoleFieldErrors = {};
        for (const issue of result.error.issues) {
            const field = issue.path[0] as keyof CreateRoleInput;
            if (field && !fieldErrors[field]) {
                fieldErrors[field] = issue.message;
            }
        }
        const firstError = result.error.issues[0]?.message || 'Validasi gagal.';
        return { success: false, error: firstError, fieldErrors, data: null };
    }

    return { success: true, error: null, fieldErrors: null, data: result.data };
}

export function validateRoleForm(raw: {
    name: string;
}): RoleFieldErrors {
    const parsed = {
        name: raw.name,
    };

    const result = createRoleSchema.safeParse(parsed);
    if (result.success) return {};

    const fieldErrors: RoleFieldErrors = {};
    for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateRoleInput;
        if (field && !fieldErrors[field]) {
            fieldErrors[field] = issue.message;
        }
    }
    return fieldErrors;
}