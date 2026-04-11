"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { getCommentDataInclude, PostData } from "@/lib/types";
import { createCommentSchema } from "@/validation/validation";

export async function submitComment({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  const session = await getServerSession();

  if (!session || !session.user) throw new Error("Unauthorized");

  const { user } = session;
  const { content: contentValidated } = createCommentSchema.parse({ content });

  const newComment = prisma.comment.create({
    data: {
      content: contentValidated,
      postId: post.id,
      userId: user.id,
    },
    include: getCommentDataInclude(user.id),
  });

  return newComment;
}

export async function deleteComment(id: string) {
  const session = await getServerSession();

  if (!session || !session.user) throw new Error("Unauthorized");

  const { user } = session;

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
