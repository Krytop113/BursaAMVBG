import { getAllUsersRouteHandler, createUserRouteHandler } from "@/routes/4.userRoutes";

export async function GET(){
    return getAllUsersRouteHandler();
}

export async function POST(request: Request) {
    return createUserRouteHandler(request);
}