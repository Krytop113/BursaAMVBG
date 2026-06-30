import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth';

export async function withAuth(request: NextRequest, next: () => Promise<NextResponse>) {
    const sessionToken = request.cookies.get('user_session')?.value;
    const user = sessionToken ? await verifyTokenEdge(sessionToken) : null;
    const { pathname } = request.nextUrl;

    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (user && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!user && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return next();
}