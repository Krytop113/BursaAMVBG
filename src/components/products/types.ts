// Shared types for the Products feature

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  qrCode: string;
  categoryId: number;
  categoryName: string;
  status: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
}
