import { forgotPasswordController } from "@/controllers/auth/forgotPassword";

export async function POST(request: Request) {
    return forgotPasswordController.forgotPassword(request);
}
