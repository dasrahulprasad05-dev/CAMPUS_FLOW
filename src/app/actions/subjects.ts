"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function getSubjects() {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  return prisma.subject.findMany({
    include: { department: true },
    orderBy: { name: "asc" },
  });
}

export async function createSubject(data: { name: string; code: string; creditHours: number; departmentId: string; description?: string }) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  const subject = await prisma.subject.create({
    data: {
      name: data.name,
      code: data.code,
      creditHours: data.creditHours,
      departmentId: data.departmentId,
      description: data.description,
    },
  });

  revalidatePath("/admin/academics");
  return subject;
}

export async function updateSubject(id: string, data: { name: string; code: string; creditHours: number; departmentId: string; description?: string }) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  const subject = await prisma.subject.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/academics");
  return subject;
}

export async function deleteSubject(id: string) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  await prisma.subject.delete({
    where: { id },
  });

  revalidatePath("/admin/academics");
}
