import { NextResponse } from 'next/server';
import { userService } from '@/services/userService';
import { withErrorHandler } from '@/lib/apiHandler';
import { toUserResponse } from '@/dto/userDto';

export const DELETE = withErrorHandler('user.DELETE', async (
    request: Request,
    context?: unknown
): Promise<NextResponse> => {
    const { params } = context as { params: Promise<{ id: string }> };
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id, 10);
    await userService.delete(userId);
    return NextResponse.json({ message: 'User berhasil dihapus!' });
});

export const PUT = withErrorHandler('user.PUT', async (
    request: Request,
    context?: unknown
): Promise<NextResponse> => {
    const { params } = context as { params: Promise<{ id: string }> };
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id, 10);
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
});

