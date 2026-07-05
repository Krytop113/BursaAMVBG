import { roleModel } from "@/models/roleModel";
import { NextResponse } from "next/server";

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

}