import { NextResponse } from 'next/server';
import { userModel } from '@/models/userModel';
import { validateLogin } from '@/validators/authValidator';
import bcrypt from 'bcryptjs';
import { sessionService } from "@/lib/session";

export const loginController = {
    async login(request: Request): Promise<NextResponse> {
        try {
            const body = await request.json();

            const validation = validateLogin(body);
            if (!validation.success) {
                return NextResponse.json(
                    { error: validation.error },
                    { status: 400 }
                );
            }

            const { email, password } = validation.data;

            const user = await userModel.findByEmail(email);
            if (!user) {
                return NextResponse.json(
                    { error: 'Email atau password salah!' },
                    { status: 400 }
                );
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return NextResponse.json(
                    { error: 'Email atau password salah!' },
                    { status: 400 }
                );
            }

            const jwt = await sessionService.create(user.id, user.username, user.roleId);

            const response = NextResponse.json({
                message: 'Login berhasil!',
                user: { id: user.id, username: user.username, role: user.roleId },
            });

            response.cookies.set(sessionService.COOKIE_NAME, jwt, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 2,
                path: '/'
            });

            return response;

        } catch (error) {
            console.error('Error saat login:', error);
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    }
};