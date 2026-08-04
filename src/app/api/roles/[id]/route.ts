import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { withErrorHandler } from '@/lib/apiHandler';

export const DELETE = withErrorHandler('roles.DELETE', async (
    request: Request,
    context?: unknown
): Promise<NextResponse> => {
    const { params } = context as { params: Promise<{ id: string }> };
    const resolvedParams = await params;
    const roleId = parseInt(resolvedParams.id, 10);
    await prisma.role.delete({
        where: { id: roleId },
    });
    return NextResponse.json(
        { message: 'Role berhasil dihapus!' },
        { status: 200 }
    );
});