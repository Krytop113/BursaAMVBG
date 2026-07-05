import prisma from '@/lib/db';
import { User } from '@prisma/client';

export type { User };

export const userModel = {
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    async findById(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    async getAllWithRole(): Promise<User[]> {
        return prisma.user.findMany({
            include: { role: true },
            orderBy: { createdAt: 'asc' },
        });
    },

    async insert(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        return prisma.user.create({
            data,
        });
    },

    async update(id: number, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    },

    async delete(id: number): Promise<User> {
        return prisma.user.delete({
            where: { id },
        });
    },
};