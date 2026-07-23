import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { userController } from "@/controllers/userController";

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return userController.updateProfile(request, session.id);
}
