"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import {
  UpdateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/validation/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validationValues = UpdateUserProfileSchema.safeParse(values);
  if (!validationValues.success) {
    throw new Error("Invalid inputs!");
  }
  const session = await getServerSession();
  if (!session || !session.user) throw new Error("Unauthorized");

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: validationValues.data,
    select: getUserDataSelect(session.user.id),
  });
  return updatedUser;
}
