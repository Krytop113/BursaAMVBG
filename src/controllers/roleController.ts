import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { validateCreateRole } from '@/validators/roleValidator';
import { withErrorHandler } from '@/lib/apiHandler';
import { ValidationError } from '@/lib/errors';

export const roleController = {
    getAllRoles: withErrorHandler('roleController.getAllRoles', async (): Promise<NextResponse> => {
        const roles = await prisma.role.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json({
            message: 'Daftar role berhasil diambil!',
            roles: roles.map(role => ({ id: role.id, name: role.name })),
        });
    }),

    createRole: withErrorHandler('roleController.createRole', async (request: Request): Promise<NextResponse> => {
        const body = await request.json();
        const validation = validateCreateRole({ name: body.name });

        if (!validation.success) {
            throw new ValidationError(validation.error, validation.fieldErrors as Record<string, string>);
        }

        const role = await prisma.role.create({
            data: validation.data,
        });
        return NextResponse.json(
            { message: 'Role berhasil dibuat!', role },
            { status: 201 }
        );
    }),

    deleteRole: withErrorHandler('roleController.deleteRole', async (id: number): Promise<NextResponse> => {
        await prisma.role.delete({
            where: { id },
        });
        return NextResponse.json(
            { message: 'Role berhasil dihapus!' },
            { status: 200 }
        );
    }),
};