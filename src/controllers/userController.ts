import { NextResponse } from 'next/server';
import { userModel } from '@/models/userModel';
import bcrypt from 'bcryptjs';

export const userController = {
  async getUserById(userId: number): Promise<NextResponse> {
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
      const users = await userModel.getAllWithRole();
      return NextResponse.json({
        message: 'Daftar user berhasil diambil!',
        users: users.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role.name,
        })),
      });

    } catch (error) {
      console.error('Error saat mengambil daftar user:', error);
      return NextResponse.json(
        { error: 'Terjadi kesalahan internal server.' },
        { status: 500 }
      );
    }
  },

  async createUser(request: Request): Promise<NextResponse> {
    try {
      const body = await request.json();
      
      if (!body.password) {
        return NextResponse.json(
          { error: 'Password wajib diisi!' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);

      const user = await userModel.insert({
        username: body.username,
        email: body.email,
        password: hashedPassword,
        roleId: Number(body.roleId),
        status: body.status || 'active',
      });

      return NextResponse.json({
        message: 'User berhasil dibuat!',
        user: { id: user.id, username: user.username, email: user.email, role: user.roleId },
      });

    } catch (error) {
      console.error('Error saat membuat user:', error);
      return NextResponse.json(
        { error: 'Terjadi kesalahan internal server.' },
        { status: 500 }
      );
    }
  },

  async deleteUser(userId: number): Promise<NextResponse> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return NextResponse.json(
          { error: 'User tidak ditemukan!' },
          { status: 404 }
        );
      }

      await userModel.delete(userId);
      return NextResponse.json({
        message: 'User berhasil dihapus!',
      });

    } catch (error) {
      console.error('Error saat menghapus user:', error);
      return NextResponse.json(
        { error: 'Terjadi kesalahan internal server.' },
        { status: 500 }
      );
    }
  }
};
