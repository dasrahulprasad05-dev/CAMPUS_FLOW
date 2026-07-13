"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function getTeacherAssignments() {
  const profile = await requireUser();
  if (profile.role !== "teacher") throw new Error("Unauthorized");

  return prisma.assignment.findMany({
    where: {
      teachingAssignment: {
        teacherProfileId: profile.id
      }
    },
    include: {
      teachingAssignment: {
        include: {
          subject: true,
          section: true,
        }
      },
      submissions: true, // to count them
    },
    orderBy: { dueDate: "asc" }
  });
}

export async function createAssignment(data: {
  teachingAssignmentId: string;
  title: string;
  description: string;
  dueDate: Date;
  totalMarks: number;
}) {
  const profile = await requireUser();
  if (profile.role !== "teacher") throw new Error("Unauthorized");

  const assignment = await prisma.assignment.create({
    data,
  });

  revalidatePath("/teacher/assignments");
  return assignment;
}

export async function deleteAssignment(id: string) {
  const profile = await requireUser();
  if (profile.role !== "teacher") throw new Error("Unauthorized");

  await prisma.assignment.delete({
    where: { id }
  });

  revalidatePath("/teacher/assignments");
}
