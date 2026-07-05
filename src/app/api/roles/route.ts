import { getAllRolesRouteHandler } from "@/routes/5.roleRoutes";

export async function GET(): Promise<Response> {
    return getAllRolesRouteHandler();
}