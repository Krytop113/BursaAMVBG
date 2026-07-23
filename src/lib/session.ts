import prisma from "@/lib/db";
import crypto from "crypto";
import { signToken, verifyTokenEdge, COOKIE_NAME } from "@/lib/auth";

export const sessionService = {
    COOKIE_NAME,
    generateToken() {
        return crypto.randomUUID();
    },

    async create(userId: number, username: string, roleId: number): Promise<string> {
        const sessionToken = this.generateToken();
        await prisma.session.deleteMany({
            where: { userId }
        });
        const expires = new Date();
        expires.setHours(expires.getHours() + 2);
        await prisma.session.create({
            data: {
                userId,
                sessionToken,
                expires
            }
        });
        const jwt = await signToken({
            id: userId,
            username,
            role: roleId,
            sessionToken,
        });
        return jwt;
    },

    async validateFromJWT(jwtToken: string) {
        const payload = await verifyTokenEdge(jwtToken);
        if (!payload) return null;
        const session = await prisma.session.findUnique({
            where: { sessionToken: payload.sessionToken },
            include: { users: true }
        });
        if (!session) return null;
        if (session.expires < new Date()) {
            await prisma.session.delete({
                where: { id: session.id }
            });
            return null;
        }
        return { session, payload };
    },

    async destroy(sessionToken: string) {
        await prisma.session.deleteMany({
            where: { sessionToken }
        });
    },
};