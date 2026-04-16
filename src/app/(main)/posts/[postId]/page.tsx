import FollowButton from "@/components/follow-button";
import Linkify from "@/components/linkify";
import Post from "@/components/posts/post";
import UserAvatar from "@/components/user-avatar";
import UserTooltip from "@/components/user-tooltip";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, ReactNode, Suspense } from "react";
import parse from "html-react-parser";
import { Children } from "react";
interface PageProps {
  params: Promise<{ postId: string }>;
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  if (!postId) throw new Error("postId is undefined");

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { postId } = await params;

  const session = await getServerSession();
  if (!session?.user) return {};

  const post = await getPost(postId, session.user.id);
  function extractText(node: any): string {
    if (typeof node === "string") return node;

    if (Array.isArray(node)) {
      return node.map(extractText).join(" ");
    }

    if (node?.props?.children) {
      return extractText(node.props.children);
    }

    return "";
  }

  const parsed = parse(post.content) as any;
  const text =
    extractText(parsed).trim().length > 50
      ? extractText(parsed).slice(0, 50).trim() + "..."
      : extractText(parsed).slice(0, 50).trim();

  return {
    title: post.content ? text : `${post.user.displayUsername}'s post`,
  };
}

export default async function Page({ params }: PageProps) {
  const { postId } = await params;

  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return (
      <p className="text-destructive">
        You're not authorized to view this page.
      </p>
    );
  }

  const post = await getPost(postId, user.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
    </main>
  );
}
