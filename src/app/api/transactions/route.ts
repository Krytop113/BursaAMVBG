import { getTransactionsRouteHandler, createTransactionRouteHandler } from "@/routes/6.transactionRoutes";

export async function GET() {
    return getTransactionsRouteHandler();
}

export async function POST(request: Request) {
    return createTransactionRouteHandler(request);
}
