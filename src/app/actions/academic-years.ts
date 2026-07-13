"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function getAcademicYears() {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  return prisma.academicYear.findMany({
    orderBy: { startDate: "desc" },
  });
}

export async function createAcademicYear(data: { name: string; startDate: Date; endDate: Date; isCurrent: boolean }) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  if (data.isCurrent) {
    // Unmark any existing current academic year
    await prisma.academicYear.updateMany({
      where: { isCurrent: true },
      data: { isCurrent: false },
    });
  }

  const ay = await prisma.academicYear.create({
    data,
  });

  revalidatePath("/admin/academics");
  return ay;
}

export async function updateAcademicYear(id: string, data: { name: string; startDate: Date; endDate: Date; isCurrent: boolean }) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  if (data.isCurrent) {
    // Unmark any existing current academic year
    await prisma.academicYear.updateMany({
      where: { id: { not: id }, isCurrent: true },
      data: { isCurrent: false },
    });
  }

  const ay = await prisma.academicYear.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/academics");
  return ay;
}

export async function deleteAcademicYear(id: string) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  await prisma.academicYear.delete({
    where: { id },
  });

  revalidatePath("/admin/academics");
}
