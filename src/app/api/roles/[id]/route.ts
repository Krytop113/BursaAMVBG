import { roleController } from "@/controllers/roleController";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const roleId = parseInt(resolvedParams.id, 10);
    return roleController.deleteRole(roleId);
}