import { productController } from "@/controllers/productController";

export async function GET() {
    return productController.getAllProducts();
}

export async function POST(request: Request) {
    return productController.createProduct(request);
}
