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

import { parseZodErrors, parseZodResult } from '@/lib/parseZodErrors';

export function validateCreateUser(data: unknown) {
    return parseZodResult<CreateUserInput, typeof createUserSchema>(createUserSchema, data);
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
    if (result.success) return {};

    return parseZodErrors<CreateUserInput>(result.error);
}