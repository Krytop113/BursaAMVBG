import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge, COOKIE_NAME } from '@/lib/auth';
import { ROLES } from '@/lib/constants';

export async function withRole(request: NextRequest, next: () => Promise<NextResponse>) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = await verifyTokenEdge(token);
    if (!payload || payload.role !== ROLES.ADMIN) {
        if (request.nextUrl.pathname.startsWith('/api/')) {
            return NextResponse.json(
                { error: 'Akses ditolak! Anda bukan Admin.' },
                { status: 403 }
            );
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return next();
}