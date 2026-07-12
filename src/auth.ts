import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import type { UserRole } from "@/types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: UserRole }).role;
        token.isActive = (user as { isActive: boolean }).isActive;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.isActive = token.isActive as boolean;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);
        if (!result.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: result.data.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            password: true,
            role: true,
            isActive: true,
          },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(
          result.data.password,
          user.password,
        );

        if (!passwordMatch) return null;
        if (!user.isActive) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          isActive: user.isActive,
        };
      },
    }),
  ],
});
