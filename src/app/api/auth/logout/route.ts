import { logoutController } from "@/controllers/auth/logout";

export async function POST() {
    return logoutController.logout();
}
