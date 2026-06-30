import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function withRole(request: NextRequest, next: () => Promise<NextResponse>) {
    return next();
}