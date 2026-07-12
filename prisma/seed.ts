import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL || "";
const adapter = new PrismaNeon({ connectionString: url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database with demo accounts...");

  const passwordHash = await bcrypt.hash("password123", 10);

  const users = [
    {
      name: "Admin User",
      email: "admin@campusflow.edu",
      password: passwordHash,
      role: "admin" as UserRole,
      isActive: true,
    },
    {
      name: "Teacher Smith",
      email: "teacher@campusflow.edu",
      password: passwordHash,
      role: "teacher" as UserRole,
      isActive: true,
    },
    {
      name: "Student John",
      email: "student@campusflow.edu",
      password: passwordHash,
      role: "student" as UserRole,
      isActive: true,
    },
    {
      name: "Parent Doe",
      email: "parent@campusflow.edu",
      password: passwordHash,
      role: "parent" as UserRole,
      isActive: true,
    },
  ];

  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });
    
    if (!existingUser) {
      await prisma.user.create({
        data: user,
      });
      console.log(`Created ${user.role} account: ${user.email}`);
    } else {
      console.log(`${user.role} account already exists: ${user.email}`);
    }
  }

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
