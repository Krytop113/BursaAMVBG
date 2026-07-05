import { productController } from "@/controllers/productController";

export async function getProductsRouteHandler(): Promise<Response> {
    return productController.getAllProducts();
}

export async function createProductRouteHandler(request: Request): Promise<Response> {
    return productController.createProduct(request);
}

export async function deleteProductRouteHandler(id: number): Promise<Response> {
    return productController.deleteProduct(id);
}
