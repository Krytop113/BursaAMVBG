import { transactionController } from "@/controllers/transactionController";

export async function getTransactionsRouteHandler(): Promise<Response> {
    return transactionController.getAllTransactions();
}

export async function createTransactionRouteHandler(request: Request): Promise<Response> {
    return transactionController.createTransaction(request);
}

export async function deleteTransactionRouteHandler(id: string): Promise<Response> {
    return transactionController.deleteTransaction(id);
}
