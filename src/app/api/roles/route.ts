import { roleController } from "@/controllers/roleController";

export async function GET() {
    return roleController.getAllRoles();
}

export async function POST(request: Request) {
    return roleController.createRole(request);
}