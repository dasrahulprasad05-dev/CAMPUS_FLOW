"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { ExamType } from "@prisma/client";

export async function getMarksForAssignment(teachingAssignmentId: string) {
  const profile = await requireUser();
  if (profile.role !== "teacher") throw new Error("Unauthorized");

  return prisma.internalMarks.findMany({
    where: { teachingAssignmentId },
    include: {
      student: {
        include: { studentProfile: true }
      }
    },
  });
}

export async function saveMarks(
  teachingAssignmentId: string, 
  title: string,
  examType: ExamType,
  maxMarks: number,
  records: { studentId: string; marksObtained: number }[]
) {
  const profile = await requireUser();
  if (profile.role !== "teacher") throw new Error("Unauthorized");

  // Create the internal marks records
  await prisma.$transaction(
    records.map(record => 
      prisma.internalMarks.create({
        data: {
          teachingAssignmentId,
          studentId: record.studentId,
          examType,
          title,
          marksObtained: record.marksObtained,
          maxMarks,
        }
      })
    )
  );

  revalidatePath("/teacher/gradebook");
  return { success: true };
}
