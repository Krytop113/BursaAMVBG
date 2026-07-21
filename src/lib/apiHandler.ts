import { NextResponse } from 'next/server';
import { AppError } from './errors';

export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  label: string,
  handler: T
): T {
  const wrapped = async (...args: Parameters<T>): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error: any) {
      console.error(`[Error - ${label}]:`, error);

      if (error instanceof AppError) {
        return NextResponse.json(
          {
            error: error.message,
            ...(error as any).fieldErrors ? { fieldErrors: (error as any).fieldErrors } : {},
          },
          { status: error.statusCode }
        );
      }

      const isPrismaError = typeof error === 'object' && error !== null && 'code' in error;
      if (isPrismaError && error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Data yang dimasukkan sudah digunakan oleh data lain.' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: error.message || 'Terjadi kesalahan internal server.' },
        { status: 500 }
      );
    }
  };

  return wrapped as T;
}
