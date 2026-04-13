"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
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
  const { user } = session;

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: validationValues.data,
      select: getUserDataSelect(user.id),
    });
    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        name: validationValues.data.displayUsername,
        username: validationValues.data.displayUsername,
      },
    });

    const groupChannels = await streamServerClient.queryChannels(
      { type: "messaging", members: { $in: [user.id] } },
      undefined,
      { state: true, watch: false, limit: 100 },
    );

    await Promise.all(
      groupChannels
        .filter((channel) => Object.keys(channel.state.members).length > 2)
        .map((channel) => {
          const memberNames = Object.values(channel.state.members)
            .map((member) => {
              if (member.user?.id === user.id) {
                return validationValues.data.displayUsername;
              }
              return member.user?.name || member.user?.id;
            })
            .join(", ");
          return (channel as any).updatePartial({
            set: { name: memberNames },
          });
        }),
    );

    return updatedUser;
  });
  return updatedUser;
}
