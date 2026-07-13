import prisma from '@/lib/db';
import { Product } from '@prisma/client';
import path from 'path';
import { promises as fs } from 'fs';

export type { Product };

export const productModel = {
    async findById(id: string): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { id },
        });
    },

    async findByQrCode(qrCode: string): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { qrCode },
        });
    },

    async getAllWithCategories() {
        return prisma.product.findMany({
            include: {
                category: true,
            },
            orderBy: { createdAt: 'asc' },
        });
    },

    async getNextProductId(categoryId: number, price: number): Promise<string> {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            select: { name: true },
        });
        const categoryCode = category ? category.name.substring(0, 2).toUpperCase() : 'PR';

        const priceStr = String(price).replace(/[^0-9]/g, '');
        const priceCode = priceStr.substring(0, 2).padEnd(2, '0');

        const products = await prisma.product.findMany({
            select: { id: true },
        });

        let maxNum = 0;
        for (const p of products) {
            const parts = p.id.split('-');
            const lastPart = parts[parts.length - 1];
            if (lastPart) {
                const num = parseInt(lastPart, 10);
                if (!isNaN(num) && num > maxNum) {
                    maxNum = num;
                }
            }
        }

        const nextNum = maxNum + 1;
        const seqCode = String(nextNum).padStart(3, '0');

        return `${categoryCode}-${priceCode}-${seqCode}`;
    },

    async deleteImage(id: string): Promise<void> {
        const product = await prisma.product.findUnique({
            where: { id },
            select: { image_url: true },
        });

        if (!product || !product.image_url) {
            return;
        }

        try {
            const fileName = path.basename(product.image_url);
            const absolutePath = path.resolve(process.cwd(), 'public', 'uploads', fileName);
            try {
                await fs.access(absolutePath);
                await fs.unlink(absolutePath);
            } catch (fsError: any) {
                if (fsError.code === 'ENOENT') {
                    console.warn(`File tidak ditemukan di sistem: ${absolutePath}`);
                } else {
                    throw fsError;
                }
            }

        } catch (error) {
            console.error('Error saat menghapus gambar produk:', error);
            throw new Error('Gagal menghapus gambar produk');
        }
    },

    async insert(data: Omit<Product, 'createdAt' | 'updatedAt' | 'price' | 'buyPrice'> & { price: any; buyPrice: any }): Promise<Product> {
        return prisma.product.create({
            data,
        });
    },

    async update(id: string, data: Omit<Partial<Product>, 'id' | 'createdAt' | 'updatedAt' | 'price' | 'buyPrice'> & { price?: any; buyPrice?: any }): Promise<Product> {
        return prisma.product.update({
            where: { id },
            data,
        });
    },

    async delete(id: string): Promise<Product> {
        try {
            await productModel.deleteImage(id);
        } catch (err) {
            console.error("Gagal menghapus file gambar saat menghapus produk:", err);
        }
        return prisma.product.delete({
            where: { id },
        });
    },
};