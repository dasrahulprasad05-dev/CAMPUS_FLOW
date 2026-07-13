"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function getDepartments() {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  return prisma.department.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createDepartment(data: { name: string; code: string; description?: string }) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  const dept = await prisma.department.create({
    data: {
      name: data.name,
      code: data.code,
      description: data.description,
    },
  });

  revalidatePath("/admin/academics");
  return dept;
}

export async function updateDepartment(id: string, data: { name: string; code: string; description?: string }) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  const dept = await prisma.department.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/academics");
  return dept;
}

export async function deleteDepartment(id: string) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  await prisma.department.delete({
    where: { id },
  });

  revalidatePath("/admin/academics");
}
