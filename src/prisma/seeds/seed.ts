import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./role";
import { seedUsers } from "./user";

const prisma = new PrismaClient();

async function main() {
  await seedRoles(prisma);
  await seedUsers(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });