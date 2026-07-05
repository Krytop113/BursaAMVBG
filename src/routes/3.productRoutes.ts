import { productController } from "@/controllers/productController";
import { categoryController } from "@/controllers/categoryController";

export async function getProductsRouteHandler(): Promise<Response> {
    return productController.getAllProducts();
}

export async function createProductRouteHandler(request: Request): Promise<Response> {
    return productController.createProduct(request);
}

export async function deleteProductRouteHandler(id: number): Promise<Response> {
    return productController.deleteProduct(id);
}

export async function getCategoriesRouteHandler(): Promise<Response> {
    return categoryController.getAllCategories();
}
