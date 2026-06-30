import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from './middlewares/withAuth';

export async function proxy(request: NextRequest) {
    return await withAuth(request, async () => {
        return NextResponse.next();
    });
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};