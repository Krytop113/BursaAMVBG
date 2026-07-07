import { roleModel } from "@/models/roleModel";
import { NextResponse } from "next/server";
import { validateCreateRole } from "@/validators/roleValidator";

export const roleController = {
    async getAllRoles(): Promise<NextResponse> {
        try {
            const roles = await roleModel.getAll();
            return NextResponse.json({
                message: 'Daftar role berhasil diambil!',
                roles: roles.map(role => ({
                    id: role.id,
                    name: role.name
                })),
            });
        } catch (error) {
            console.error('Error saat mengambil daftar role:', error);
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    },

    async createRole(request: Request): Promise<NextResponse> {
        try {
            const body = await request.json();
            const validation = validateCreateRole({
                name: body.name,
            });

            if (!validation.success) {
                return NextResponse.json(
                    { error: validation.error, fieldErrors: validation.fieldErrors },
                    { status: 400 }
                );
            }

            const role = await roleModel.insert(validation.data);
            return NextResponse.json(
                { message: 'Role berhasil dibuat!', role },
                { status: 201 }
            );
        } catch (error) {
            console.error('Error saat membuat role:', error);
            const isPrismaError = typeof error === 'object' && error !== null && 'code' in error;
            if (isPrismaError && (error as any).code === 'P2002') {
                return NextResponse.json(
                    { error: 'Role dengan nama tersebut sudah ada.' },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    },

    async deleteRole(id: number): Promise<NextResponse> {
        try {
            await roleModel.delete(id);
            return NextResponse.json(
                { message: 'Role berhasil dihapus!' },
                { status: 200 }
            );
        } catch (error) {
            console.error('Error saat menghapus role:', error);
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    }
}