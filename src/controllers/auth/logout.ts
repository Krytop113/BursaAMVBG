import { NextResponse } from 'next/server';

export const logoutController = {
    async logout(): Promise<NextResponse> {
        try {
            const response = NextResponse.json({ message: 'Logout berhasil!' });
            response.cookies.delete('session');
            return response;
        } catch (error) {
            console.error('Error saat logout:', error);
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    }
};