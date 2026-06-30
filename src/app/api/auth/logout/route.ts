import { logoutRouteHandler } from "@/routes/authRoutes";

export async function POST() {
    return logoutRouteHandler();
}
