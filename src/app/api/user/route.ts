import { userController } from "@/controllers/userController";

export async function GET() {
    return userController.getAllUsers();
}

export async function POST(request: Request) {
    return userController.createUser(request);
}