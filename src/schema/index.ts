import { z } from 'zod';

export const SignInFormSchema = z.object({
  email: z.string().trim().email({message: "Invalid email address"}),
  password: z.string().min(1, {message: "Password is required"}).max(256),
});

export const SignUpFormSchema = z.object({
  name: z.string().trim().min(1, {message: "Name is required"}).max(256),
  email: z.string().trim().email({message: "Invalid email address"}),
  password: z.string().min(8, {message: "Minimum of 8 characters required"}).max(256),
});