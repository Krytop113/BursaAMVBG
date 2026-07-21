import { categoryController } from "@/controllers/categoryController";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const categoryId = parseInt(resolvedParams.id, 10);
    return categoryController.deleteCategory(categoryId);
}
