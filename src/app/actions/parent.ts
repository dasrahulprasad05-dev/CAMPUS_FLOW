"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function getParentLinkedStudents() {
  const profile = await requireUser();
  if (profile.role !== "parent") throw new Error("Unauthorized");

  const links = await prisma.parentStudentLink.findMany({
    where: { parentId: profile.id, isVerified: true },
    include: {
      student: {
        include: {
          studentProfile: {
            include: {
              department: true,
              section: true,
            }
          }
        }
      }
    }
  });

  return links.map(link => link.student);
}

export async function getStudentFees(studentId: string) {
  const profile = await requireUser();
  if (profile.role !== "parent") throw new Error("Unauthorized");

  // Basic security: ensure parent is linked to this student
  const link = await prisma.parentStudentLink.findUnique({
    where: { parentId_studentId: { parentId: profile.id, studentId } }
  });
  if (!link || !link.isVerified) throw new Error("Unauthorized access to student records");

  return prisma.feeRecord.findMany({
    where: { studentId },
    orderBy: { dueDate: "asc" }
  });
}

export async function getStudentProgress(studentId: string) {
  const profile = await requireUser();
  if (profile.role !== "parent") throw new Error("Unauthorized");

  // Basic security
  const link = await prisma.parentStudentLink.findUnique({
    where: { parentId_studentId: { parentId: profile.id, studentId } }
  });
  if (!link || !link.isVerified) throw new Error("Unauthorized access to student records");

  // Fetch grades
  const grades = await prisma.internalMarks.findMany({
    where: { studentId },
    include: { teachingAssignment: { include: { subject: true } } },
    orderBy: { createdAt: "desc" }
  });

  // Fetch attendance summary
  const attendance = await prisma.attendance.findMany({
    where: { studentId },
  });

  return { grades, attendance };
}
