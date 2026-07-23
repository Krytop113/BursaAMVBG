import { transactionController } from "@/controllers/transactionController";

export async function GET() {
    return transactionController.getAllTransactions();
}

export async function POST(request: Request) {
    return transactionController.createTransaction(request);
}
