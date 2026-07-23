import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./1.role";
import { seedUsers } from "./2.user";
import { seedCategory } from "./3.category";

const prisma = new PrismaClient();

async function main() {
  await seedRoles(prisma);
  await seedUsers(prisma);
  await seedCategory(prisma);
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