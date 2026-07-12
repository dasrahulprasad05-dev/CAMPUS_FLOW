import type { UserRole } from "@/types";
import "next-auth";

declare module "next-auth" {
  interface User {
    role: UserRole;
    isActive: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      isActive: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    isActive: boolean;
  }
}
