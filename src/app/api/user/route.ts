import { NextResponse } from 'next/server';
import { userService } from '@/services/userService';
import { withErrorHandler } from '@/lib/apiHandler';
import { toUserResponse, toUserWithRoleResponse } from '@/dto/userDto';

export const GET = withErrorHandler('user.GET', async (): Promise<NextResponse> => {
    const users = await userService.getAll();
    return NextResponse.json({
        message: 'Daftar user berhasil diambil!',
        users: users.map(toUserWithRoleResponse),
    });
});

export const POST = withErrorHandler('user.POST', async (request: Request): Promise<NextResponse> => {
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
});