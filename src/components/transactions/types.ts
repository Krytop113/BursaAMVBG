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

export interface Product {
  id: string;
  name: string;
  qrCode: string;
  stock: number;
}
