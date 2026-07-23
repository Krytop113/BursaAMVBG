import { NextResponse } from 'next/server';
import { authService } from '@/services/authService';
import { withErrorHandler } from '@/lib/apiHandler';
import { BadRequestError } from '@/lib/errors';

export const forgotPasswordController = {
    forgotPassword: withErrorHandler('forgotPasswordController.forgotPassword', async (request: Request): Promise<NextResponse> => {
        const body = await request.json();
        const { action, identifier, pin, password } = body;

        if (action === 'verify-user') {
            const userDetails = await authService.verifyUser(identifier);
            return NextResponse.json({
                success: true,
                message: 'User ditemukan.',
                user: userDetails,
            });
        }

        if (action === 'verify-pin') {
            await authService.verifyPin(identifier, pin);
            return NextResponse.json({
                success: true,
                message: 'PIN terverifikasi.',
            });
        }

        if (action === 'reset') {
            await authService.resetPassword(identifier, pin, password);
            return NextResponse.json({
                success: true,
                message: 'Password berhasil diubah. Silakan login kembali.',
            });
        }

        throw new BadRequestError('Aksi tidak valid!');
    })
};