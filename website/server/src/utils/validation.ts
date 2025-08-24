import { z } from 'zod';
import { AppError } from './errorHandler.js';

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new AppError(`Invalid request: ${messages}`, 400);
    }
    throw error;
  }
}
