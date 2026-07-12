"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import { dashboardForRole } from "@/lib/auth";
import type { UserRole } from "@/types";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      error:
        result.error.issues[0]?.message ??
        "Please check the information you entered.",
    };
  }

  // Check isActive before attempting sign-in
  const user = await prisma.user.findUnique({
    where: { email: result.data.email },
    select: { role: true, isActive: true },
  });

  if (user && !user.isActive) {
    return {
      error: "This account has been disabled. Contact an administrator.",
    };
  }

  try {
    await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    });
  } catch (error) {
    // NextAuth signIn() throws NEXT_REDIRECT on success with redirect: true.
    // With redirect: false it may still throw in some versions.
    // Re-throw redirect errors so Next.js handles them, only catch AuthError.
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "The email address or password is incorrect." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    // Re-throw any other error (including NEXT_REDIRECT)
    throw error;
  }

  // Fetch role for redirect
  const freshUser = await prisma.user.findUnique({
    where: { email: result.data.email },
    select: { role: true },
  });

  redirect(dashboardForRole((freshUser?.role ?? "student") as UserRole));
}
