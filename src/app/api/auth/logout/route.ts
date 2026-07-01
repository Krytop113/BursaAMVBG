import { logoutRouteHandler } from "@/routes/1.authRoutes";

export async function POST() {
    return logoutRouteHandler();
}
