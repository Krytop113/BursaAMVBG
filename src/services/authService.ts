import prisma from '@/lib/db';
import { sessionService } from '@/lib/session';
import { validateLogin } from '@/validators/authValidator';
import { BadRequestError, ValidationError, NotFoundError } from '@/lib/errors';
import bcrypt from 'bcryptjs';

export type LoginInput = { identifier: string; password: string };

export type LoginResult = {
    jwt: string;
    user: { id: number; username: string; roleId: number };
    cookieOptions: {
        secure: boolean;
        sameSite: 'none' | 'lax';
    };
};

function resolveCookieOptions(requestUrl: string, requestHeaders: Headers): LoginResult['cookieOptions'] {
    const forwardedProto = requestHeaders.get('x-forwarded-proto') || '';
    const isHttps = forwardedProto === 'https' || requestUrl.startsWith('https://');
    const isProduction = process.env.NODE_ENV === 'production';
    const useSecure = isHttps || isProduction;
    return {
        secure: useSecure,
        sameSite: useSecure ? 'none' : 'lax',
    };
}

async function findUserByIdentifier(identifier: string) {
    const byEmail = await prisma.user.findUnique({ where: { email: identifier } });
    if (byEmail) return byEmail;
    return prisma.user.findFirst({ where: { username: identifier } });
}

export const authService = {
    async login(body: unknown, requestUrl: string, requestHeaders: Headers): Promise<LoginResult> {
        const validation = validateLogin(body);
        if (!validation.success) {
            throw new ValidationError(validation.error);
        }

        const { identifier, password } = validation.data;

        const user = await findUserByIdentifier(identifier);

        if (!user) {
            throw new BadRequestError('Email/Username atau password salah!');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new BadRequestError('Email/Username atau password salah!');
        }

        const jwt = await sessionService.create(user.id, user.username, user.roleId);
        const cookieOptions = resolveCookieOptions(requestUrl, requestHeaders);

        return {
            jwt,
            user: { id: user.id, username: user.username, roleId: user.roleId },
            cookieOptions,
        };
    },

    async logout(sessionToken: string): Promise<void> {
        await sessionService.destroy(sessionToken);
    },

    async verifyUser(identifier: string) {
        if (!identifier) throw new BadRequestError('Email atau Username wajib diisi!');
        const user = await findUserByIdentifier(identifier);
        if (!user) throw new NotFoundError('User tidak ditemukan!');
        return {
            username: user.username,
            email: user.email,
        };
    },

    async verifyPin(identifier: string, pin: string) {
        if (!identifier) throw new BadRequestError('Email atau Username wajib diisi!');
        if (!pin) throw new BadRequestError('PIN keamanan wajib diisi!');

        const user = await findUserByIdentifier(identifier);
        if (!user) throw new NotFoundError('User tidak ditemukan!');

        const isHashed = user.pin.startsWith('$2a$') || user.pin.startsWith('$2y$') || user.pin.startsWith('$2b$');
        let isMatch = false;

        if (isHashed) {
            isMatch = await bcrypt.compare(pin, user.pin);
        } else {
            isMatch = user.pin === pin;
            if (isMatch) {
                const hashed = await bcrypt.hash(pin, 10);
                await prisma.user.update({
                    where: { id: user.id },
                    data: { pin: hashed },
                });
            }
        }

        if (!isMatch) {
            throw new BadRequestError('PIN keamanan salah!');
        }

        return true;
    },

    async resetPassword(identifier: string, pin: string, password: string) {
        if (!identifier) throw new BadRequestError('Email atau Username wajib diisi!');
        if (!pin) throw new BadRequestError('PIN keamanan wajib diisi!');
        if (!password || password.length < 6) {
            throw new BadRequestError('Password minimal harus 6 karakter!');
        }

        const user = await findUserByIdentifier(identifier);
        if (!user) throw new NotFoundError('User tidak ditemukan!');

        const isHashed = user.pin.startsWith('$2a$') || user.pin.startsWith('$2y$') || user.pin.startsWith('$2b$');
        let isPinMatch = false;

        if (isHashed) {
            isPinMatch = await bcrypt.compare(pin, user.pin);
        } else {
            isPinMatch = user.pin === pin;
        }

        if (!isPinMatch) {
            throw new BadRequestError('PIN keamanan tidak valid atau salah!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updateData: { password: string; pin?: string } = { password: hashedPassword };

        if (!isHashed) {
            updateData.pin = await bcrypt.hash(pin, 10);
        }

        await prisma.user.update({
            where: { id: user.id },
            data: updateData,
        });

        return true;
    }
};


