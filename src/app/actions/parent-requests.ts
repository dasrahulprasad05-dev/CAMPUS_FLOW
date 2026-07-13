"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function getParentRequests() {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  return prisma.parentRequest.findMany({
    include: {
      parent: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveParentRequest(requestId: string) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  const request = await prisma.parentRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) throw new Error("Request not found");

  // Find student by roll number
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { rollNumber: request.studentRollNumber },
    include: { user: true },
  });

  if (!studentProfile) {
    throw new Error(`Student with roll number ${request.studentRollNumber} not found.`);
  }

  // Create link
  await prisma.parentStudentLink.create({
    data: {
      parentId: request.parentId,
      studentId: studentProfile.userId,
      relationship: request.relationship,
      isVerified: true,
    },
  });

  // Update request status
  await prisma.parentRequest.update({
    where: { id: requestId },
    data: { 
      status: "approved",
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin/users");
}

export async function rejectParentRequest(requestId: string) {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  await prisma.parentRequest.update({
    where: { id: requestId },
    data: { 
      status: "rejected",
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin/users");
}

export async function getApprovedParents() {
  const profile = await requireUser();
  if (profile.role !== "admin") throw new Error("Unauthorized");

  return prisma.parentStudentLink.findMany({
    where: { isVerified: true },
    include: {
      parent: true,
      student: {
        include: { studentProfile: true }
      }
    },
    orderBy: { parent: { name: "asc" } },
  });
}
