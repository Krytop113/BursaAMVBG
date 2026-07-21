import { NextResponse } from 'next/server';
import { authService } from '@/services/authService';
import { withErrorHandler } from '@/lib/apiHandler';
import { sessionService } from '@/lib/session';

export const loginController = {
    login: withErrorHandler('loginController.login', async (request: Request): Promise<NextResponse> => {
        const body = await request.json();
        const { jwt, user, cookieOptions } = await authService.login(body, request.url, request.headers as Headers);

        const response = NextResponse.json({
            message: 'Login berhasil!',
            user: { id: user.id, username: user.username, role: user.roleId },
        });

        response.cookies.set(sessionService.COOKIE_NAME, jwt, {
            httpOnly: true,
            secure: cookieOptions.secure,
            sameSite: cookieOptions.sameSite,
            maxAge: 60 * 60 * 2,
            path: '/',
        });

        return response;
    }),
};