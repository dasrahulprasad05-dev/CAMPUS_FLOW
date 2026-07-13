"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function getTeachingAssignments() {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  return prisma.teachingAssignment.findMany({
    include: {
      teacher: { include: { user: true } },
      subject: true,
      department: true,
      section: true,
      academicYear: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function createTeachingAssignment(data: {
  teacherProfileId: string;
  subjectId: string;
  departmentId: string;
  semester: number;
  sectionId: string;
  academicYearId: string;
}) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  const assignment = await prisma.teachingAssignment.create({
    data,
  });

  revalidatePath("/admin/academics");
  return assignment;
}

export async function deleteTeachingAssignment(id: string) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  await prisma.teachingAssignment.delete({
    where: { id },
  });

  revalidatePath("/admin/academics");
}
