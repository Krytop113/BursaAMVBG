import { NextResponse } from 'next/server';
import { productModel } from "@/models/productModel";
import { validateCreateProduct } from "@/validators/productValidator";
import path from 'path';
import fs from 'fs/promises';

export const productController = {
    async getAllProducts(): Promise<NextResponse> {
        try {
            const products = await productModel.getAllWithCategories();
            return NextResponse.json({
                message: 'Daftar produk berhasil diambil!',
                products: products.map(product => ({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: Number(product.price),
                    buyPrice: Number(product.buyPrice),
                    stock: product.stock,
                    qrCode: product.qrCode,
                    categoryId: product.categoryId,
                    categoryName: product.category.name,
                    status: product.stock > 0 ? 'Aktif' : 'Habis',
                    imageUrl: product.image_url,
                    createdAt: product.createdAt,
                })),
            });
        } catch (error) {
            console.error('Error saat mengambil daftar produk:', error);
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    },

    async createProduct(request: Request): Promise<NextResponse> {
        try {
            const contentType = request.headers.get('content-type') || '';
            let name = '';
            let description = '';
            let price = 0;
            let buyPrice = 0;
            let stock = 0;
            let categoryId = 0;
            let imageFile: File | null = null;

            if (contentType.includes('multipart/form-data')) {
                const formData = await request.formData();
                name = (formData.get('name') as string) || '';
                description = (formData.get('description') as string) || '';
                price = Number(formData.get('price') || 0);
                buyPrice = Number(formData.get('buyPrice') || 0);
                stock = Number(formData.get('stock') || 0);
                categoryId = Number(formData.get('categoryId') || 0);
                imageFile = formData.get('image') as File | null;
            } else {
                const body = await request.json();
                name = body.name || '';
                description = body.description || '';
                price = Number(body.price || 0);
                buyPrice = Number(body.buyPrice || 0);
                stock = Number(body.stock || 0);
                categoryId = Number(body.categoryId || 0);
            }

            let qrCode = '';
            let attempts = 0;
            const sanitized = name
                .replace(/[^A-Za-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            
            while (attempts < 10) {
                const randomNum = Math.floor(10000 + Math.random() * 90000);
                const candidate = sanitized ? `${sanitized}_${randomNum}` : `PROD_${randomNum}`;
                const existing = await productModel.findByQrCode(candidate);
                if (!existing) {
                    qrCode = candidate;
                    break;
                }
                attempts++;
            }

            if (!qrCode) {
                return NextResponse.json(
                    { error: 'Gagal membuat QR Code yang unik.' },
                    { status: 500 }
                );
            }

            const validation = validateCreateProduct({
                name,
                description,
                price,
                buyPrice,
                stock,
                qrCode,
                categoryId,
            });

            if (!validation.success) {
                return NextResponse.json(
                    {
                        error: validation.error,
                        fieldErrors: validation.fieldErrors,
                    },
                    { status: 422 }
                );
            }

            let imageUrl = '';
            if (imageFile && imageFile.size > 0) {
                const bytes = await imageFile.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const fileExtension = imageFile.name.split('.').pop() || 'png';
                const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExtension}`;

                const uploadDir = path.join(process.cwd(), 'public', 'uploads');
                await fs.mkdir(uploadDir, { recursive: true });

                const filePath = path.join(uploadDir, fileName);
                await fs.writeFile(filePath, buffer);

                imageUrl = `/uploads/${fileName}`;
            }

            const productId = await productModel.getNextProductId(categoryId, price);

            const product = await productModel.insert({
                ...validation.data,
                id: productId,
                qrCode,
                image_url: imageUrl,
            });

            return NextResponse.json(
                { message: 'Produk berhasil ditambahkan!', product },
                { status: 201 }
            );
        } catch (error: unknown) {
            console.error('Error saat membuat produk:', error);
            const isPrismaError = typeof error === 'object' && error !== null && 'code' in error;
            if (isPrismaError && (error as { code: string }).code === 'P2002') {
                return NextResponse.json(
                    {
                        error: 'QR Code sudah digunakan oleh produk lain.',
                        fieldErrors: { qrCode: 'QR Code sudah digunakan oleh produk lain.' },
                    },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    },

    async deleteProduct(id: string): Promise<NextResponse> {
        try {
            if (id) {
                await productModel.deleteImage(id);
            }
            await productModel.delete(id);
            return NextResponse.json(
                { message: 'Produk berhasil dihapus!' },
                { status: 200 }
            );
        } catch (error) {
            console.error('Error saat menghapus produk:', error);
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    },

    async updateProduct(request: Request, id: string): Promise<NextResponse> {
        try {
            const existingProduct = await productModel.findById(id);
            if (!existingProduct) {
                return NextResponse.json(
                    { error: 'Produk tidak ditemukan!' },
                    { status: 404 }
                );
            }

            const contentType = request.headers.get('content-type') || '';
            let name = existingProduct.name;
            let description = existingProduct.description;
            let price = Number(existingProduct.price);
            let buyPrice = Number(existingProduct.buyPrice);
            let stock = existingProduct.stock;
            let categoryId = existingProduct.categoryId;
            let imageFile: File | null = null;

            if (contentType.includes('multipart/form-data')) {
                const formData = await request.formData();
                if (formData.has('name')) name = (formData.get('name') as string) || '';
                if (formData.has('description')) description = (formData.get('description') as string) || '';
                if (formData.has('price')) price = Number(formData.get('price') || 0);
                if (formData.has('buyPrice')) buyPrice = Number(formData.get('buyPrice') || 0);
                if (formData.has('stock')) stock = Number(formData.get('stock') || 0);
                if (formData.has('categoryId')) categoryId = Number(formData.get('categoryId') || 0);
                imageFile = formData.get('image') as File | null;
            } else {
                const body = await request.json();
                if (body.name !== undefined) name = body.name;
                if (body.description !== undefined) description = body.description;
                if (body.price !== undefined) price = Number(body.price);
                if (body.buyPrice !== undefined) buyPrice = Number(body.buyPrice);
                if (body.stock !== undefined) stock = Number(body.stock);
                if (body.categoryId !== undefined) categoryId = Number(body.categoryId);
            }

            const validation = validateCreateProduct({
                name,
                description,
                price,
                buyPrice,
                stock,
                qrCode: existingProduct.qrCode,
                categoryId,
            });

            if (!validation.success) {
                return NextResponse.json(
                    {
                        error: validation.error,
                        fieldErrors: validation.fieldErrors,
                    },
                    { status: 422 }
                );
            }

            let imageUrl = existingProduct.image_url;
            if (imageFile && imageFile.size > 0) {
                if (existingProduct.image_url) {
                    try {
                        await productModel.deleteImage(id);
                    } catch (err) {
                        console.error('Gagal menghapus gambar lama:', err);
                    }
                }

                const bytes = await imageFile.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const fileExtension = imageFile.name.split('.').pop() || 'png';
                const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExtension}`;

                const uploadDir = path.join(process.cwd(), 'public', 'uploads');
                await fs.mkdir(uploadDir, { recursive: true });

                const filePath = path.join(uploadDir, fileName);
                await fs.writeFile(filePath, buffer);

                imageUrl = `/uploads/${fileName}`;
            }

            const updatedProduct = await productModel.update(id, {
                name: validation.data.name,
                description: validation.data.description,
                price: validation.data.price,
                buyPrice: validation.data.buyPrice,
                stock: validation.data.stock,
                categoryId: validation.data.categoryId,
                image_url: imageUrl,
            });

            return NextResponse.json(
                { message: 'Produk berhasil diperbarui!', product: updatedProduct },
                { status: 200 }
            );
        } catch (error: unknown) {
            console.error('Error saat memperbarui produk:', error);
            return NextResponse.json(
                { error: 'Terjadi kesalahan internal server.' },
                { status: 500 }
            );
        }
    },
};