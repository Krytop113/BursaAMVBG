export const ROLES = {
    ADMIN: 1,
    KASIR: 2,
} as const;

export type RoleId = (typeof ROLES)[keyof typeof ROLES];
