import { categoryController } from "@/controllers/categoryController";

export async function GET() {
    return categoryController.getAllCategories();
}

export async function POST(request: Request) {
    return categoryController.createCategory(request);
}