import { NextResponse } from 'next/server';
import { AppError, ValidationError, ConflictError } from './errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  label: string,
  handler: T
): T {
  const wrapped = async (...args: Parameters<T>): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error: unknown) {
      console.error(`[Error - ${label}]:`, error);

      if (error instanceof AppError) {
        const fieldErrors = error instanceof ValidationError || error instanceof ConflictError ? error.fieldErrors : undefined;
        return NextResponse.json(
          {
            error: error.message,
            ...(fieldErrors ? { fieldErrors } : {}),
          },
          { status: error.statusCode }
        );
      }

      const isPrismaError = typeof error === 'object' && error !== null && 'code' in error;
      if (isPrismaError && (error as { code?: string }).code === 'P2002') {
        return NextResponse.json(
          { error: 'Data yang dimasukkan sudah digunakan oleh data lain.' },
          { status: 409 }
        );
      }

      const message = error instanceof Error ? error.message : 'Terjadi kesalahan internal server.';
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
  };

  return wrapped as T;
}

