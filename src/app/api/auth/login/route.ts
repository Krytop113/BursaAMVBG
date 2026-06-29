import { loginRouteHandler } from "@/routes/authRoutes";

export async function POST(request: Request) {
    return loginRouteHandler(request);
}
