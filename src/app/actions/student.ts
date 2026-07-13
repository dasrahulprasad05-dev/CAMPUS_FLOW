"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function getStudentProfile() {
  const profile = await requireUser();
  if (profile.role !== "student") throw new Error("Unauthorized");

  const studentData = await prisma.studentProfile.findUnique({
    where: { userId: profile.id },
    include: {
      department: true,
      section: true,
      user: true,
    }
  });

  return studentData;
}

export async function getStudentCourses() {
  const profile = await requireUser();
  if (profile.role !== "student") throw new Error("Unauthorized");

  const studentData = await prisma.studentProfile.findUnique({
    where: { userId: profile.id },
  });

  if (!studentData) return [];

  // Find teaching assignments that match the student's department, semester, and section
  return prisma.teachingAssignment.findMany({
    where: {
      departmentId: studentData.departmentId,
      semester: studentData.semester,
      sectionId: studentData.sectionId,
    },
    include: {
      subject: true,
      teacher: { include: { user: true } },
    }
  });
}

export async function getStudentAttendance() {
  const profile = await requireUser();
  if (profile.role !== "student") throw new Error("Unauthorized");

  return prisma.attendance.findMany({
    where: { studentId: profile.id },
    include: {
      teachingAssignment: {
        include: { subject: true }
      }
    },
    orderBy: { date: "desc" }
  });
}

export async function getStudentAssignments() {
  const profile = await requireUser();
  if (profile.role !== "student") throw new Error("Unauthorized");

  const studentData = await prisma.studentProfile.findUnique({
    where: { userId: profile.id },
  });

  if (!studentData) return [];

  return prisma.assignment.findMany({
    where: {
      teachingAssignment: {
        departmentId: studentData.departmentId,
        semester: studentData.semester,
        sectionId: studentData.sectionId,
      }
    },
    include: {
      teachingAssignment: { include: { subject: true, teacher: { include: { user: true } } } },
      submissions: {
        where: { studentId: profile.id }
      }
    },
    orderBy: { dueDate: "asc" }
  });
}

export async function getStudentGrades() {
  const profile = await requireUser();
  if (profile.role !== "student") throw new Error("Unauthorized");

  return prisma.internalMarks.findMany({
    where: { studentId: profile.id },
    include: {
      teachingAssignment: { include: { subject: true } }
    },
    orderBy: { createdAt: "desc" }
  });
}
