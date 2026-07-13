"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function getSections() {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  return prisma.section.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createSection(data: { name: string }) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  const section = await prisma.section.create({
    data: {
      name: data.name,
    },
  });

  revalidatePath("/admin/academics");
  return section;
}

export async function updateSection(id: string, data: { name: string }) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  const section = await prisma.section.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/academics");
  return section;
}

export async function deleteSection(id: string) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  await prisma.section.delete({
    where: { id },
  });

  revalidatePath("/admin/academics");
}
