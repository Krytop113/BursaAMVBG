import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedUsers(prisma: PrismaClient) {
    const pass = await bcrypt.hash("password123", 10);
    await prisma.user.upsert({
        where: { email: "admin@bursa.com" },
        update: {},
        create: {
            email: "admin@bursa.com",
            username: "admin",
            password: pass,
            roleId: 1,
        },
    });

    await prisma.user.upsert({
        where: { email: "bursa@bursa.com" },
        update: {},
        create: {
            email: "bursa@bursa.com",
            username: "bursa",
            password: pass,
            roleId: 2,
        },
    });
}