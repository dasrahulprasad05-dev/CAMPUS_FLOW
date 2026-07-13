import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/types";

export const authConfig = {
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
    // Prevent adapter from interfering with credentials sign-in
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        // User was already verified in authorize(); allow sign-in
        return true;
      }
      return true;
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
