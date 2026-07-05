import prisma from '@/lib/db';
import { Role } from '@prisma/client';

export type { Role };

export const roleModel = {
    async findByName(name: string): Promise<Role | null> {
        return prisma.role.findUnique({
            where: { name },
        });
    },

    async findById(id: number): Promise<Role | null> {
        return prisma.role.findUnique({
            where: { id },
        });
    },

    async getAll(): Promise<Role[]> {
        return prisma.role.findMany({
            orderBy: { name: 'asc' },
        });
    },
}