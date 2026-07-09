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

    async getNextProductId(): Promise<string> {
        const products = await prisma.product.findMany({
            select: { id: true },
        });

        let maxNum = 0;
        for (const p of products) {
            const match = p.id.match(/^P(\d+)$/);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxNum) {
                    maxNum = num;
                }
            }
        }

        const nextNum = maxNum + 1;
        return `P${String(nextNum).padStart(3, '0')}`;
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

    async insert(data: Omit<Product, 'createdAt' | 'updatedAt' | 'price'> & { price: any }): Promise<Product> {
        return prisma.product.create({
            data,
        });
    },

    async update(id: string, data: Omit<Partial<Product>, 'id' | 'createdAt' | 'updatedAt' | 'price'> & { price?: any }): Promise<Product> {
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