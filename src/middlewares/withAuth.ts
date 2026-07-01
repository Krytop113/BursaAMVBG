import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/auth";

export async function withAuth(request: NextRequest, next: () => Promise<NextResponse>) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    const { pathname } = request.nextUrl;

    const publicRoutes = ["/login", "/forgot-password"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (isPublicRoute) {
        return next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = await verifyTokenEdge(token);

    if (!payload) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", String(payload?.id || ""));

    return next();
}