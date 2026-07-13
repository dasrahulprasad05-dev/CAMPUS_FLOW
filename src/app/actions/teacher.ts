"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function getTeacherAssignments() {
  const profile = await requireUser();
  if (profile.role !== "teacher") throw new Error("Unauthorized");

  return prisma.teachingAssignment.findMany({
    where: { teacherProfileId: profile.id },
    include: {
      subject: true,
      department: true,
      section: true,
      academicYear: true,
    },
    orderBy: {
      subject: { name: "asc" }
    }
  });
}

export async function getEnrolledStudents(departmentId: string, semester: number, sectionId: string) {
  const profile = await requireUser();
  if (profile.role !== "teacher") throw new Error("Unauthorized");

  return prisma.studentProfile.findMany({
    where: {
      departmentId,
      semester,
      sectionId,
    },
    include: {
      user: true,
    },
    orderBy: {
      rollNumber: "asc"
    }
  });
}
