import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .refine(value => !/\s/.test(value), 'Password must not contain spaces')
  .refine(value => /[a-z]/.test(value), 'Password must include a lowercase letter')
  .refine(value => /[A-Z]/.test(value), 'Password must include an uppercase letter')
  .refine(value => /\d/.test(value), 'Password must include a number')
  .refine(value => /[^\w\s]/.test(value), 'Password must include a symbol');

const credentialsSchema = z.object({
  userName: z.string().trim().min(1, 'Please enter a username'),
  password: passwordSchema,
});

export const signInSchema = credentialsSchema;

export const registerSchema = credentialsSchema
  .extend({
    email: z.string().trim().email('Please enter a valid email address'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    secretToken: z.string().trim().min(1, 'Please enter the secret token'),
  })
  .refine(values => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
