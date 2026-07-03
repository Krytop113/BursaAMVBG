import { getProductsRouteHandler, createProductRouteHandler } from "@/routes/3.productRoutes";

export async function GET() {
    return getProductsRouteHandler();
}

export async function POST(request: Request) {
    return createProductRouteHandler(request);
}
