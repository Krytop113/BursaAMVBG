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

    async insert(data: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: string }): Promise<Role> {
        return prisma.role.create({
            data,
        });
    },

    async update(id: number, data: Omit<Partial<Role>, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> {
        return prisma.role.update({
            where: { id },
            data,
        });
    },

    async delete(id: number): Promise<Role> {
        return prisma.role.delete({
            where: { id },
        });
    },
}