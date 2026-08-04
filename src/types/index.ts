export interface Category {
  id: number;
  name: string;
}

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

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string | number;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  productQrCode: string;
  productPrice: number;
  productBuyPrice: number;
  type: 'IN' | 'OUT';
  quantity: number;
  note: string;
  createdAt: string;
}
