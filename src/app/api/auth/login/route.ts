import { loginController } from "@/controllers/auth/login";

export async function POST(request: Request) {
    return loginController.login(request);
}
