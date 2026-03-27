"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { createPostSchema } from "@/validation/validation";

export async function submitPost(parsedInput: string, textInput: string) {
  const session = await getServerSession();
  if (!session || !session?.user) {
    throw new Error("Unauthorized");
  }

  if (!textInput || !textInput.trim()) {
    return {
      error: true,
      message: "Invalid inputs!",
    };
  }
  const user = session.user;
  const { content } = createPostSchema.parse({
    content: parsedInput,
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
