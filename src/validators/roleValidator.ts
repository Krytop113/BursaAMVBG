import { z } from 'zod';

export const createRoleSchema = z.object({
    name: z
        .string({ message: 'Nama role wajib diisi!' })
        .min(3, 'Nama role minimal 3 karakter!')
        .max(100, 'Nama role maksimal 100 karakter!'),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type RoleFieldErrors = Partial<Record<keyof CreateRoleInput, string>>;

import { parseZodErrors, parseZodResult } from '@/lib/parseZodErrors';

export function validateCreateRole(data: unknown) {
    return parseZodResult<CreateRoleInput, typeof createRoleSchema>(createRoleSchema, data);
}

export function validateRoleForm(raw: {
    name: string;
}): RoleFieldErrors {
    const parsed = {
        name: raw.name,
    };

    const result = createRoleSchema.safeParse(parsed);
    if (result.success) return {};

    return parseZodErrors<CreateRoleInput>(result.error);
}