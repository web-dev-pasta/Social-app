"use server";
import { Post } from "@/generated/prisma/client";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
export async function deletePost(id: Post["id"]) {
  try {
    const session = await getServerSession();
    if (!session || !session?.user) {
      throw new Error("Unauthorized");
    }

    if (!id) {
      throw new Error("Invalid inputs");
    }
    const deletedPost = await prisma.post.delete({
      where: {
        id,
      },
    });
    return {
      message: "Post deleted successfully",
      success: true,
      deletedPost,
    };
  } catch (error) {
    throw new Error((error as Error).message ?? "Internal server error");
  }
}
