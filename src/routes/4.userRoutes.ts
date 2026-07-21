import { userController } from "@/controllers/userController";

export async function getUserbyIdRouteHandler(id: number): Promise<Response> {
    return userController.getUserById(id);
}

export async function getAllUsersRouteHandler(): Promise<Response> {
    return userController.getAllUsers();
}

export async function createUserRouteHandler(request: Request): Promise<Response> {
    return userController.createUser(request);
}

export async function deleteUserRouteHandler(id: number): Promise<Response> {
    return userController.deleteUser(id);
}

export async function updateUserRouteHandler(request: Request, id: number): Promise<Response> {
    return userController.updateUser(request, id);
}