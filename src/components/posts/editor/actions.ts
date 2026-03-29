"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/validation/validation";
interface SubmitPostInput {
  toSubmitInput: string;
  textInput: string;
}

export async function submitPost({
  toSubmitInput,
  textInput,
}: SubmitPostInput) {
  try {
    const session = await getServerSession();
    if (!session || !session?.user) {
      throw new Error("Unauthorized");
    }

    if (!textInput || !textInput.trim()) {
      throw new Error("Invalid inputs");
    }
    const user = session.user;
    const { content } = createPostSchema.parse({
      content: toSubmitInput,
    });
    const newPost = await prisma.post.create({
      data: {
        content,
        userId: user.id,
      },
      include: getPostDataInclude,
    });

    return {
      message: "Post created successfully",
      success: true,
      newPost,
    };
  } catch (error) {
    throw new Error((error as Error).message ?? "Internal server error");
  }
}
