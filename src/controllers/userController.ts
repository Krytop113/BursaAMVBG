import { NextResponse } from 'next/server';
import { userModel, User } from '@/models/userModel';
import bcrypt from 'bcryptjs';
import { withErrorHandler } from '@/lib/apiHandler';
import { BadRequestError, NotFoundError } from '@/lib/errors';

async function getUserOrThrow(userId: number): Promise<User> {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new NotFoundError('User tidak ditemukan!');
  }
  return user;
}

type UserUpdatePayload = Partial<Pick<User, 'username' | 'email' | 'password' | 'roleId'>>;

export const userController = {
  getUserById: withErrorHandler('userController.getUserById', async (userId: number): Promise<NextResponse> => {
    const user = await getUserOrThrow(userId);
    return NextResponse.json({
      message: 'User ditemukan!',
      user: { id: user.id, username: user.username, email: user.email, role: user.roleId },
    });
  }),

  getAllUsers: withErrorHandler('userController.getAllUsers', async (): Promise<NextResponse> => {
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
  }),

  createUser: withErrorHandler('userController.createUser', async (request: Request): Promise<NextResponse> => {
    const body = await request.json();

    if (!body.password) {
      throw new BadRequestError('Password wajib diisi!');
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
  }),

  deleteUser: withErrorHandler('userController.deleteUser', async (userId: number): Promise<NextResponse> => {
    await getUserOrThrow(userId);
    await userModel.delete(userId);
    return NextResponse.json({
      message: 'User berhasil dihapus!',
    });
  }),

  updateProfile: withErrorHandler('userController.updateProfile', async (request: Request, userId: number): Promise<NextResponse> => {
    const body = await request.json();
    const { username, email, password } = body;

    const existingUser = await getUserOrThrow(userId);
    const updateData: UserUpdatePayload = {};

    if (username) updateData.username = username;

    if (email && email !== existingUser.email) {
      const emailCheck = await userModel.findByEmail(email);
      if (emailCheck) {
        throw new BadRequestError('Email sudah digunakan oleh pengguna lain!');
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
  }),

  updateUser: withErrorHandler('userController.updateUser', async (request: Request, userId: number): Promise<NextResponse> => {
    const existingUser = await getUserOrThrow(userId);

    const body = await request.json();
    const { username, email, roleId, password } = body;

    const updateData: UserUpdatePayload = {};

    if (username) updateData.username = username;
    if (roleId) updateData.roleId = Number(roleId);

    if (email && email !== existingUser.email) {
      const emailCheck = await userModel.findByEmail(email);
      if (emailCheck) {
        throw new BadRequestError('Email sudah digunakan oleh pengguna lain!');
      }
      updateData.email = email;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length > 0) {
      const updated = await userModel.update(userId, updateData);
      return NextResponse.json({
        message: 'User berhasil diperbarui!',
        user: { id: updated.id, username: updated.username, email: updated.email, role: updated.roleId }
      });
    }

    return NextResponse.json({
      message: 'Tidak ada perubahan data.',
      user: { id: existingUser.id, username: existingUser.username, email: existingUser.email, role: existingUser.roleId }
    });
  }),
};
