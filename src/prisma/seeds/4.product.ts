import { PrismaClient } from "@prisma/client";

export async function seedProduct(prisma: PrismaClient) {
    await prisma.product.upsert({
        where: { qrCode: "QRA" },
        update: {},
        create: {
            id: "P001",
            name: "Product A",
            description: "Description for Product A",
            stock: 100,
            price: 2000.00,
            image_url: "",
            qrCode: "QRA",
            categoryId: 1
        }
    });

    await prisma.product.upsert({
        where: { qrCode: "QRB" },
        update: {},
        create: {
            id: "P002",
            name: "Product B",
            description: "Description for Product B",
            stock: 20,
            price: 12000.00,
            image_url: "",
            qrCode: "QRB",
            categoryId: 2
        }
    });

    await prisma.product.upsert({
        where: { qrCode: "QRC" },
        update: {},
        create: {
            id: "P003",
            name: "Product C",
            description: "Description for Product C",
            stock: 10,
            price: 15000.00,
            image_url: "",
            qrCode: "QRC",
            categoryId: 3
        }
    });
}
