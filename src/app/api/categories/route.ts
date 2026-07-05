import { getCategoriesRouteHandler, createCategoryRouteHandler } from "@/routes/2.categoryRoutes";

export async function GET() {
    return getCategoriesRouteHandler();
}

export async function POST(request: Request) {
    return createCategoryRouteHandler(request);
}