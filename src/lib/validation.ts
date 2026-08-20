import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
    email: z.string().trim().email("Invalid email address").toLowerCase(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password must be at most 128 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const codeSnippetSchema = z.object({
  title: z.string().trim().default(""),
  language: z.string().trim().default("javascript"),
  code: z.string().default(""),
});

export const solutionSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  description: z.string().trim().min(1, "Description is required"),
  problemDescription: z.string().trim().default(""),
  solutionSteps: z.string().trim().default(""),
  status: z.enum(["open", "resolved"]).default("open"),
  difficulty: z.enum(["easy", "medium", "hard"]).default("easy"),
  tags: z.array(z.string().trim()).default([]),
  codeSnippets: z.array(codeSnippetSchema).default([]),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SolutionInput = z.infer<typeof solutionSchema>;

