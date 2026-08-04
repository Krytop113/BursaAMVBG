import prisma from '@/lib/db';
import { User } from '@prisma/client';
import { BadRequestError, NotFoundError } from '@/lib/errors';
import bcrypt from 'bcryptjs';

type UserWithRole = User & { role: { name: string } };

type CreateUserInput = {
    username: string;
    email: string;
    password: string;
    roleId: number;
    status?: string;
};

type UpdateUserInput = Partial<{
    username: string;
    email: string;
    password: string;
    roleId: number;
}>;

async function requireUser(userId: number): Promise<User> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User tidak ditemukan!');
    return user;
}

export const userService = {
    async getById(userId: number): Promise<User> {
        return requireUser(userId);
    },

    async getAll(): Promise<UserWithRole[]> {
        return prisma.user.findMany({
            include: { role: true },
            orderBy: { createdAt: 'asc' },
        }) as Promise<UserWithRole[]>;
    },

    async create(input: CreateUserInput & { pin?: string }): Promise<User> {
        if (!input.password) throw new BadRequestError('Password wajib diisi!');

        const hashedPassword = await bcrypt.hash(input.password, 10);
        const rawPin = input.pin || '123456';
        const hashedPin = await bcrypt.hash(rawPin, 10);

        return prisma.user.create({
            data: {
                username: input.username,
                email: input.email,
                password: hashedPassword,
                roleId: input.roleId,
                status: input.status || 'active',
                pin: hashedPin,
            },
        });
    },

    async delete(userId: number): Promise<void> {
        await requireUser(userId);
        await prisma.user.delete({ where: { id: userId } });
    },

    async updateProfile(userId: number, input: UpdateUserInput): Promise<{ updated: User; changed: boolean }> {
        const existingUser = await requireUser(userId);
        const updateData: Partial<User> = {};

        if (input.username) updateData.username = input.username;

        if (input.email && input.email !== existingUser.email) {
            const emailInUse = await prisma.user.findUnique({ where: { email: input.email } });
            if (emailInUse) throw new BadRequestError('Email sudah digunakan oleh pengguna lain!');
            updateData.email = input.email;
        }

        if (input.password) {
            updateData.password = await bcrypt.hash(input.password, 10);
        }

        if (Object.keys(updateData).length === 0) {
            return { updated: existingUser, changed: false };
        }

        const updated = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
        return { updated, changed: true };
    },

    async updateUser(userId: number, input: UpdateUserInput): Promise<{ updated: User; changed: boolean }> {
        const existingUser = await requireUser(userId);
        const updateData: Partial<User> = {};

        if (input.username) updateData.username = input.username;
        if (input.roleId) updateData.roleId = input.roleId;

        if (input.email && input.email !== existingUser.email) {
            const emailInUse = await prisma.user.findUnique({ where: { email: input.email } });
            if (emailInUse) throw new BadRequestError('Email sudah digunakan oleh pengguna lain!');
            updateData.email = input.email;
        }

        if (input.password) {
            updateData.password = await bcrypt.hash(input.password, 10);
        }

        if (Object.keys(updateData).length === 0) {
            return { updated: existingUser, changed: false };
        }

        const updated = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
        return { updated, changed: true };
    },
};

