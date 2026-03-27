"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { createPostSchema } from "@/validation/validation";

export async function submitPost(input: string) {
  const session = await getServerSession();
  if (!session || !session?.user) {
    throw new Error("Unauthorized");
  }
  if (!input) {
    return {
      error: true,
      message: "Invalid inputs!",
    };
  }
  const user = session.user;
  const { content } = createPostSchema.parse({
    content: input,
  });
  await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
  });
  return {
    message: "Post created successfully",
    success: true,
  };
}
