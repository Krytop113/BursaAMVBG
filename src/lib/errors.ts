export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource tidak ditemukan!') {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Permintaan tidak valid!') {
    super(message, 400);
  }
}

export class ValidationError extends AppError {
  fieldErrors?: Record<string, string>;

  constructor(message: string = 'Validasi gagal!', fieldErrors?: Record<string, string>) {
    super(message, 422);
    this.fieldErrors = fieldErrors;
  }
}

export class ConflictError extends AppError {
  fieldErrors?: Record<string, string>;

  constructor(message: string = 'Terjadi konflik data!', fieldErrors?: Record<string, string>) {
    super(message, 409);
    this.fieldErrors = fieldErrors;
  }
}
