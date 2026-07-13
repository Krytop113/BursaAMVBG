// Shared types for the Products feature

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  buyPrice: number;
  stock: number;
  qrCode: string;
  categoryId: number;
  categoryName: string;
  status: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
}
