import { deleteTransactionRouteHandler } from "@/routes/6.transactionRoutes";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return deleteTransactionRouteHandler(id);
}
