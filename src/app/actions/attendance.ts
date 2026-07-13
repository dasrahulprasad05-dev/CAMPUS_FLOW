"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { AttendanceStatus } from "@prisma/client";

export async function getAttendanceByDateAndAssignment(teachingAssignmentId: string, date: Date) {
  const profile = await requireUser();
  if (profile.role !== "teacher") throw new Error("Unauthorized");

  // Reset time to midnight for comparison
  const searchDate = new Date(date);
  searchDate.setHours(0, 0, 0, 0);
  
  const nextDate = new Date(searchDate);
  nextDate.setDate(nextDate.getDate() + 1);

  return prisma.attendance.findMany({
    where: {
      teachingAssignmentId,
      date: {
        gte: searchDate,
        lt: nextDate,
      }
    },
  });
}

export async function saveAttendance(
  teachingAssignmentId: string, 
  date: Date, 
  records: { studentId: string; status: AttendanceStatus }[]
) {
  const profile = await requireUser();
  if (profile.role !== "teacher") throw new Error("Unauthorized");

  const submitDate = new Date(date);
  submitDate.setHours(0, 0, 0, 0);

  // Use a transaction to update or insert attendance records
  await prisma.$transaction(
    records.map(record => 
      prisma.attendance.upsert({
        where: {
          teachingAssignmentId_studentId_date: {
            teachingAssignmentId,
            studentId: record.studentId,
            date: submitDate,
          }
        },
        update: {
          status: record.status,
        },
        create: {
          teachingAssignmentId,
          studentId: record.studentId,
          date: submitDate,
          status: record.status,
        }
      })
    )
  );

  revalidatePath("/teacher/attendance");
  return { success: true };
}
