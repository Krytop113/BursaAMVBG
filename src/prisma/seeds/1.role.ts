import { PrismaClient } from "@prisma/client";

export async function seedRoles(prisma: PrismaClient) {
  const roles = ["admin", "bursa"];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }
}