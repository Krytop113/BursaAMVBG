import { NextResponse } from "next/server";
import { userModel } from "@/models/userModel";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, identifier, pin, password } = body;

        if (!identifier) {
            return NextResponse.json(
                { error: "Email atau Username wajib diisi!" },
                { status: 400 }
            );
        }

        let user = await userModel.findByEmail(identifier);
        if (!user) {
            user = await userModel.findByUsername(identifier);
        }

        if (!user) {
            return NextResponse.json(
                { error: "User tidak ditemukan!" },
                { status: 404 }
            );
        }

        if (action === "verify-user") {
            return NextResponse.json({
                success: true,
                message: "User ditemukan.",
                user: {
                    username: user.username,
                    email: user.email,
                },
            });
        }

        if (action === "verify-pin") {
            if (!pin) {
                return NextResponse.json(
                    { error: "PIN keamanan wajib diisi!" },
                    { status: 400 }
                );
            }

            console.log("DEBUG PIN - DB:", (user as any).pin, "Input:", pin, "Match:", (user as any).pin === pin);
            if (!(user as any).pin || (user as any).pin !== pin) {
                return NextResponse.json(
                    { error: "PIN keamanan salah atau database belum termigrasi!" },
                    { status: 400 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "PIN terverifikasi.",
            });
        }

        if (action === "reset") {
            console.log("DEBUG RESET - DB PIN:", (user as any).pin, "Input PIN:", pin);
            if (!pin || !(user as any).pin || (user as any).pin !== pin) {
                return NextResponse.json(
                    { error: "PIN keamanan tidak valid atau salah!" },
                    { status: 400 }
                );
            }

            if (!password || password.length < 6) {
                return NextResponse.json(
                    { error: "Password minimal harus 6 karakter!" },
                    { status: 400 }
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await userModel.update(user.id, { password: hashedPassword });

            return NextResponse.json({
                success: true,
                message: "Password berhasil diubah. Silakan login kembali.",
            });
        }

        return NextResponse.json(
            { error: "Aksi tidak valid!" },
            { status: 400 }
        );

    } catch (error) {
        console.error("Error at forgot-password API:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan internal server." },
            { status: 500 }
        );
    }
}
