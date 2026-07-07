import { getAllRolesRouteHandler, createRoleRouteHandler } from "@/routes/5.roleRoutes";

export async function GET(): Promise<Response> {
    return getAllRolesRouteHandler();
}

export async function POST(request: Request): Promise<Response> {
    return createRoleRouteHandler(request);
}