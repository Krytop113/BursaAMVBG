import { loginController } from "@/controllers/auth/login";
import { forgotPasswordController } from "@/controllers/auth/forgotPassword";
import { logoutController } from "@/controllers/auth/logout";

export async function loginRouteHandler(request: Request): Promise<Response> {
    return loginController.login(request);
}

export async function forgotPasswordRouteHandler(request: Request): Promise<Response> {
    return forgotPasswordController.forgotPassword(request);
}

export async function logoutRouteHandler(request: Request): Promise<Response> {
    return logoutController.logout();
}