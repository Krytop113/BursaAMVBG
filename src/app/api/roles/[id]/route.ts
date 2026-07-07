import { deleteRoleRouteHandler } from "@/routes/5.roleRoutes";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return deleteRoleRouteHandler(Number(id));
}