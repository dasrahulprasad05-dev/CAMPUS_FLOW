"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function getTeachers() {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  return prisma.teacherProfile.findMany({
    include: {
      user: true,
      department: true,
    },
    orderBy: {
      user: { name: "asc" }
    }
  });
}

export async function createTeacher(data: { 
  name: string; 
  email: string; 
  phone?: string;
  employeeNumber: string; 
  departmentId: string; 
  designation?: string;
}) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "teacher",
      password: passwordHash,
      teacherProfile: {
        create: {
          employeeNumber: data.employeeNumber,
          departmentId: data.departmentId,
          designation: data.designation,
        }
      }
    },
    include: { teacherProfile: true }
  });

  revalidatePath("/admin/users");
  return user;
}

export async function getStudents() {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  return prisma.studentProfile.findMany({
    include: {
      user: true,
      department: true,
      section: true,
    },
    orderBy: {
      user: { name: "asc" }
    }
  });
}

export async function createStudent(data: { 
  name: string; 
  email: string; 
  phone?: string;
  rollNumber: string; 
  departmentId: string; 
  semester: number;
  sectionId: string;
  admissionYear?: number;
}) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "student",
      password: passwordHash,
      studentProfile: {
        create: {
          rollNumber: data.rollNumber,
          departmentId: data.departmentId,
          semester: data.semester,
          sectionId: data.sectionId,
          admissionYear: data.admissionYear,
        }
      }
    },
    include: { studentProfile: true }
  });

  revalidatePath("/admin/users");
  return user;
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  revalidatePath("/admin/users");
}
