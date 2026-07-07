import { roleController } from "@/controllers/roleController";

export async function getAllRolesRouteHandler(): Promise<Response> {
    return roleController.getAllRoles();
}

export async function createRoleRouteHandler(request: Request): Promise<Response> {
    return roleController.createRole(request);
}

export async function deleteRoleRouteHandler(id: number): Promise<Response> {
    return roleController.deleteRole(id);
}