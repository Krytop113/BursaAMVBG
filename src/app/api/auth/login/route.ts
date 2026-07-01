import { loginRouteHandler } from "@/routes/1.authRoutes";

export async function POST(request: Request) {
    return loginRouteHandler(request);
}
