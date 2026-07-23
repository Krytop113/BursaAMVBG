import { userController } from "@/controllers/userController";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id, 10);
    return userController.deleteUser(userId);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id, 10);
    return userController.updateUser(request, userId);
}
