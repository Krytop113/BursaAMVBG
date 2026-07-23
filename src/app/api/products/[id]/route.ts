import { productController } from "@/controllers/productController";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    return productController.deleteProduct(resolvedParams.id);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    return productController.updateProduct(request, resolvedParams.id);
}
