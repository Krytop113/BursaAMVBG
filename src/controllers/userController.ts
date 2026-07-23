import { NextResponse } from 'next/server';
import { userService } from '@/services/userService';
import { withErrorHandler } from '@/lib/apiHandler';
import { toUserResponse, toUserWithRoleResponse } from '@/dto/userDto';

export const userController = {
    getUserById: withErrorHandler('userController.getUserById', async (userId: number): Promise<NextResponse> => {
        const user = await userService.getById(userId);
        return NextResponse.json({
            message: 'User ditemukan!',
            user: toUserResponse(user),
        });
    }),

    getAllUsers: withErrorHandler('userController.getAllUsers', async (): Promise<NextResponse> => {
        const users = await userService.getAll();
        return NextResponse.json({
            message: 'Daftar user berhasil diambil!',
            users: users.map(toUserWithRoleResponse),
        });
    }),

    createUser: withErrorHandler('userController.createUser', async (request: Request): Promise<NextResponse> => {
        const body = await request.json();
        const user = await userService.create({
            username: body.username,
            email: body.email,
            password: body.password,
            roleId: Number(body.roleId),
            status: body.status,
            pin: body.pin,
        });
        return NextResponse.json(
            { message: 'User berhasil dibuat!', user: toUserResponse(user) },
            { status: 201 }
        );
    }),

    deleteUser: withErrorHandler('userController.deleteUser', async (userId: number): Promise<NextResponse> => {
        await userService.delete(userId);
        return NextResponse.json({ message: 'User berhasil dihapus!' });
    }),

    updateProfile: withErrorHandler('userController.updateProfile', async (request: Request, userId: number): Promise<NextResponse> => {
        const { username, email, password } = await request.json();
        const { updated, changed } = await userService.updateProfile(userId, { username, email, password });
        return NextResponse.json({
            message: changed ? 'Profil berhasil diperbarui!' : 'Tidak ada perubahan data.',
            user: toUserResponse(updated),
        });
    }),

    updateUser: withErrorHandler('userController.updateUser', async (request: Request, userId: number): Promise<NextResponse> => {
        const { username, email, roleId, password } = await request.json();
        const { updated, changed } = await userService.updateUser(userId, {
            username,
            email,
            roleId: roleId ? Number(roleId) : undefined,
            password,
        });
        return NextResponse.json({
            message: changed ? 'User berhasil diperbarui!' : 'Tidak ada perubahan data.',
            user: toUserResponse(updated),
        });
    }),
};
