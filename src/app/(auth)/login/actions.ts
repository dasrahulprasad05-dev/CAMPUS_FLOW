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
    if (error instanceof AuthError) {
      return { error: "The email address or password is incorrect." };
    }
    throw error;
  }

  // Fetch role for redirect
  const freshUser = await prisma.user.findUnique({
    where: { email: result.data.email },
    select: { role: true },
  });

  redirect(dashboardForRole((freshUser?.role ?? "student") as UserRole));
}

