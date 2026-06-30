import { NextResponse } from 'next/server';
import { userModel } from '@/models/userModel';
import { validateLogin } from '@/validators/authValidator';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

const COOKIE_NAME = 'user_session';

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

            const token = await signToken({
                id: user.id,
                username: user.username,
                role: user.roleId,
            });

            const response = NextResponse.json({
                message: 'Login berhasil!',
                user: { id: user.id, username: user.username, role: user.roleId },
            });

            response.cookies.set(COOKIE_NAME, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 2,
                path: '/',
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