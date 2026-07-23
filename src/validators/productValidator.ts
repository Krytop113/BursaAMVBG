import { z } from 'zod';

export const createProductSchema = z.object({
    name: z
        .string({ message: 'Nama produk wajib diisi!' })
        .min(3, 'Nama produk minimal 3 karakter!')
        .max(100, 'Nama produk maksimal 100 karakter!'),

    description: z
        .string({ message: 'Deskripsi wajib diisi!' })
        .min(10, 'Deskripsi minimal 10 karakter!')
        .max(500, 'Deskripsi maksimal 500 karakter!'),

    price: z
        .number({ message: 'Harga harus berupa angka!' })
        .positive('Harga harus lebih dari 0!')
        .max(999_999_999, 'Harga terlalu besar!'),

    buyPrice: z
        .number({ message: 'Harga beli harus berupa angka!' })
        .positive('Harga beli harus lebih dari 0!')
        .max(999_999_999, 'Harga beli terlalu besar!'),

    stock: z
        .number({ message: 'Stok harus berupa angka!' })
        .int('Stok harus bilangan bulat!')
        .min(0, 'Stok tidak boleh kurang dari 0!')
        .max(999_999, 'Stok terlalu besar!'),

    qrCode: z
        .string({ message: 'QR Code wajib diisi!' })
        .min(3, 'QR Code minimal 3 karakter!')
        .max(50, 'QR Code maksimal 50 karakter!')
        .regex(/^[A-Za-z0-9\-_]+$/, 'QR Code hanya boleh berisi huruf, angka, strip (-), dan underscore (_)!')
        .optional(),

    categoryId: z
        .number({ message: 'Kategori wajib dipilih!' })
        .int('Kategori tidak valid!')
        .positive('Pilih kategori yang valid!'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductFieldErrors = Partial<Record<keyof CreateProductInput, string>>;

import { parseZodErrors, parseZodResult } from '@/lib/parseZodErrors';

export function validateCreateProduct(data: unknown) {
    return parseZodResult<CreateProductInput, typeof createProductSchema>(createProductSchema, data);
}

export function validateProductForm(raw: {
    name: string;
    description: string;
    price: string;
    buyPrice: string;
    stock: string;
    qrCode?: string;
    categoryId: string;
}): ProductFieldErrors {
    const parsed = {
        name: raw.name,
        description: raw.description,
        price: raw.price === '' ? undefined : Number(raw.price),
        buyPrice: raw.buyPrice === '' ? undefined : Number(raw.buyPrice),
        stock: raw.stock === '' ? undefined : Number(raw.stock),
        qrCode: raw.qrCode === '' ? undefined : raw.qrCode,
        categoryId: raw.categoryId === '' ? undefined : Number(raw.categoryId),
    };

    const result = createProductSchema.safeParse(parsed);
    if (result.success) return {};

    return parseZodErrors<CreateProductInput>(result.error);
}

