import { transactionController } from "@/controllers/transactionController";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    return transactionController.deleteTransaction(resolvedParams.id);
}
