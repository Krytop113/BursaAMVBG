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
  },

  async updateProfile(request: Request, userId: number): Promise<NextResponse> {
    try {
      const body = await request.json();
      const { username, email, password } = body;

      const existingUser = await userModel.findById(userId);
      if (!existingUser) {
        return NextResponse.json(
          { error: 'User tidak ditemukan!' },
          { status: 404 }
        );
      }

      const updateData: any = {};

      if (username) updateData.username = username;

      if (email && email !== existingUser.email) {
        const emailCheck = await userModel.findByEmail(email);
        if (emailCheck) {
          return NextResponse.json(
            { error: 'Email sudah digunakan oleh pengguna lain!' },
            { status: 400 }
          );
        }
        updateData.email = email;
      }

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      if (Object.keys(updateData).length > 0) {
        const updated = await userModel.update(userId, updateData);
        return NextResponse.json({
          message: 'Profil berhasil diperbarui!',
          user: { id: updated.id, username: updated.username, email: updated.email, role: updated.roleId }
        });
      }

      return NextResponse.json({
        message: 'Tidak ada perubahan data.',
        user: { id: existingUser.id, username: existingUser.username, email: existingUser.email, role: existingUser.roleId }
      });

    } catch (error) {
      console.error('Error saat memperbarui profil:', error);
      return NextResponse.json(
        { error: 'Terjadi kesalahan internal server.' },
        { status: 500 }
      );
    }
  }
};
