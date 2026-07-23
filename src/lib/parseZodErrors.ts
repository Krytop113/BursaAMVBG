import { z, ZodError } from 'zod';

export function parseZodErrors<T>(error: ZodError): Partial<Record<keyof T, string>> {
  const fieldErrors: Partial<Record<keyof T, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof T;
    if (field && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
}

export function parseZodResult<TInput, TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  data: unknown
):
  | { success: true; error: null; fieldErrors: null; data: z.infer<TSchema> }
  | { success: false; error: string; fieldErrors: Partial<Record<keyof TInput, string>>; data: null } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const fieldErrors = parseZodErrors<TInput>(result.error);
    const firstError = result.error.issues[0]?.message || 'Validasi gagal.';
    return { success: false, error: firstError, fieldErrors, data: null };
  }

  return { success: true, error: null, fieldErrors: null, data: result.data };
}
