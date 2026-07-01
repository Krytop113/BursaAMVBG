import { NextResponse } from "next/server";
import { sessionService } from "@/lib/session";
import { verifyTokenEdge } from "@/lib/auth";
import { cookies } from "next/headers";

export const logoutController = {
    async logout() {
        const cookieStore = await cookies();
        const jwt = cookieStore.get(sessionService.COOKIE_NAME)?.value;

        if (jwt) {
            const payload = await verifyTokenEdge(jwt);
            if (payload?.sessionToken) {
                await sessionService.destroy(payload.sessionToken);
            }
        }

        const response = NextResponse.json({
            message: "Logout berhasil!"
        });

        response.cookies.delete(sessionService.COOKIE_NAME);

        return response;
    }
};