import { PrismaClient } from "@prisma/client";

export async function seedCategory(prisma: PrismaClient) {
    const category = ["a", "b", "c", "d"];

    for (const categoryName of category){
        await prisma.category.upsert({
            where: { name: categoryName},
            update: {},
            create: {name: categoryName},
        });
    }
}