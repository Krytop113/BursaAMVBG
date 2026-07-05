import { categoryController } from "@/controllers/categoryController";

export async function getCategoriesRouteHandler(): Promise<Response>{
    return categoryController.getAllCategories();
}

export async function createCategoryRouteHandler(request: Request): Promise<Response> {
    return categoryController.createCategory(request);
}

export async function deleteCategoryRouteHandler(id: number): Promise<Response> {
    return categoryController.deleteCategory(id);
}