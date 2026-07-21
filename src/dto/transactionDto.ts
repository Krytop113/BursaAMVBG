import { StockMovement } from '@prisma/client';

type ProductSnapshot = {
    name: string;
    qrCode: string;
    price: any;
    buyPrice: any;
};

export type StockMovementWithProduct = StockMovement & { product: ProductSnapshot };

export function toTransactionResponse(movement: StockMovementWithProduct) {
    return {
        id: movement.id,
        productId: movement.productId,
        productName: movement.product.name,
        productQrCode: movement.product.qrCode,
        productPrice: Number(movement.product.price),
        productBuyPrice: Number(movement.product.buyPrice),
        type: movement.type,
        quantity: movement.quantity,
        note: movement.note,
        createdAt: movement.createdAt,
    };
}

export type TransactionResponse = ReturnType<typeof toTransactionResponse>;
