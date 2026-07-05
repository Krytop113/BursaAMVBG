import { roleController } from "@/controllers/roleController";

export async function getAllRolesRouteHandler(): Promise<Response> {
    return roleController.getAllRoles();
}