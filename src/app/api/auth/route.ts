import { loginRouteHandler } from "@/routes/authRoutes";
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    return loginRouteHandler(request);
}
