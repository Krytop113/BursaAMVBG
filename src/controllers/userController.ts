import { NextResponse } from 'next/server';
import { userModel } from '@/models/userModel';

export const userController = {
  async getUserById(request: Request, userId: number): Promise<NextResponse> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return NextResponse.json(
          { error: 'User tidak ditemukan!' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: 'User ditemukan!',
        user: { id: user.id, username: user.username, email: user.email, role: user.roleId },
      });

    } catch (error) {
      console.error('Error saat mengambil user:', error);
      return NextResponse.json(
        { error: 'Terjadi kesalahan internal server.' },
        { status: 500 }
      );
    }
  },

  async getAllUsers(): Promise<NextResponse> {
    try {
      const users = await userModel.getAll();
      return NextResponse.json({
        message: 'Daftar user berhasil diambil!',
        users: users.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.roleId,
        })),
      });

    } catch (error) {
      console.error('Error saat mengambil daftar user:', error);
      return NextResponse.json(
        { error: 'Terjadi kesalahan internal server.' },
        { status: 500 }
      );
    }
  }
};
