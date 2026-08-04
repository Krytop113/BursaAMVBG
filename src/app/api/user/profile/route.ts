import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { userService } from "@/services/userService";
import { withErrorHandler } from "@/lib/apiHandler";
import { toUserResponse } from "@/dto/userDto";

export const PUT = withErrorHandler("user.profile.PUT", async (request: Request): Promise<NextResponse> => {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { username, email, password } = await request.json();
    const { updated, changed } = await userService.updateProfile(session.id, { username, email, password });
    return NextResponse.json({
        message: changed ? "Profil berhasil diperbarui!" : "Tidak ada perubahan data.",
        user: toUserResponse(updated),
    });
});

