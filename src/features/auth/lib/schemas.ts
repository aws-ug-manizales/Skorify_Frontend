import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('auth.errors.invalidEmail'),
  password: z.string().min(8, 'auth.errors.passwordMin').max(72, 'auth.errors.passwordMax'),
});

export const nicknameSchema = z
  .string()
  .trim()
  .min(3, 'auth.errors.nicknameMin')
  .max(24, 'auth.errors.nicknameMax')
  .regex(/^[a-zA-Z0-9_.-]+$/, 'auth.errors.nicknameFormat');

export const registerSchema = loginSchema.extend({
  nickname: nicknameSchema,
});

export const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'auth.passwordMismatch',
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterFormInput = z.infer<typeof registerFormSchema>;
