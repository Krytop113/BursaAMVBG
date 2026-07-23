import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from './middlewares/withAuth';
import { withRole } from './middlewares/withRole';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith('/_next') ||
        pathname.includes('/static/') ||
        pathname.match(/\.(js|css|json|ico|woff2)$/)
    ) {
        return NextResponse.next();
    }

    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/user')) {
        return NextResponse.next();
    }

    return await withAuth(request, async () => {
        const { pathname } = request.nextUrl;

        if (
            pathname.startsWith('/users') ||
            pathname.startsWith('/api/user')
        ) {
            return await withRole(request, async () => {
                return NextResponse.next();
            });
        }

        return NextResponse.next();
    });
}