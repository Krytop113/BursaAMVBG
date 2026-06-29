import { loginController } from "@/controllers/auth/login";

export async function loginRouteHandler(request: Request): Promise<Response> {
    return loginController.login(request);
}
