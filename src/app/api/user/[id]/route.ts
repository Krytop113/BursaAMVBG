import { deleteUserRouteHandler, updateUserRouteHandler } from "@/routes/4.userRoutes";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return deleteUserRouteHandler(Number(id));
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return updateUserRouteHandler(request, Number(id));
}

