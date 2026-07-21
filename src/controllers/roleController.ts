import { NextResponse } from 'next/server';
import { roleModel } from '@/models/roleModel';
import { validateCreateRole } from '@/validators/roleValidator';
import { withErrorHandler } from '@/lib/apiHandler';
import { ValidationError } from '@/lib/errors';

export const roleController = {
    getAllRoles: withErrorHandler('roleController.getAllRoles', async (): Promise<NextResponse> => {
        const roles = await roleModel.getAll();
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

        const role = await roleModel.insert(validation.data);
        return NextResponse.json(
            { message: 'Role berhasil dibuat!', role },
            { status: 201 }
        );
    }),

    deleteRole: withErrorHandler('roleController.deleteRole', async (id: number): Promise<NextResponse> => {
        await roleModel.delete(id);
        return NextResponse.json(
            { message: 'Role berhasil dihapus!' },
            { status: 200 }
        );
    }),
};