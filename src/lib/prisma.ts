import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function makePrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL || "postgres://dummy:dummy@dummy/dummy";

  if (!process.env.DATABASE_URL) {
    console.warn(
      "DATABASE_URL is not set. Using dummy connection string for build purposes. Remember to set it in your Vercel project settings.",
    );
  }

  const adapter = new PrismaNeon({ connectionString: url });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma: PrismaClient =
  globalThis.__prisma ?? makePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
