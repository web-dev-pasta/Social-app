"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/validation/validation";
interface SubmitPostInput {
  toSubmitInput: string;
  textInput: string;
  mediaIds?: string[];
}

export async function submitPost({
  toSubmitInput,
  textInput,
  mediaIds = [],
}: SubmitPostInput) {
  try {
    const session = await getServerSession();
    if (!session || !session?.user) {
      throw new Error("Unauthorized");
    }

    if ((!textInput || !textInput.trim()) && !mediaIds.length) {
      throw new Error("Invalid inputs");
    }
    const user = session.user;
    const parsedPost = createPostSchema.parse({
      content: toSubmitInput,
      mediaIds,
    });
    const content = parsedPost.content ?? "";
    const validatedMediaIds = parsedPost.mediaIds ?? [];
    const newPost = await prisma.post.create({
      data: {
        content,
        userId: user.id,
        attachments: {
          connect: validatedMediaIds.map((id) => ({ id })),
        },
      },
      include: getPostDataInclude(user.id),
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
