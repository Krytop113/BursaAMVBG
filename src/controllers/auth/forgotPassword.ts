import { NextResponse } from 'next/server';

export const forgotPasswordController = {
    async forgotPassword(request: Request): Promise<NextResponse> {
        try {
            const body = await request.json();
            // Implementation for forgot password logic
            return NextResponse.json({ message: 'Jika email terdaftar, instruksi akan dikirim.' });
        } catch (error) {
            return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
        }
    }
};