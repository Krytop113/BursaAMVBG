import { User } from '@prisma/client';

type UserWithRole = User & { role: { name: string } };

export function toUserResponse(user: User) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.roleId,
    };
}

export function toUserWithRoleResponse(user: UserWithRole) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.name,
    };
}

export type UserResponse = ReturnType<typeof toUserResponse>;
export type UserWithRoleResponse = ReturnType<typeof toUserWithRoleResponse>;
