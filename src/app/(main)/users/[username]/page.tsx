import TrendsSidebar from "@/components/trends-sidebar";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { username } from "better-auth/plugins";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

interface UserProfileProps {
  params: Promise<{ username: string }>;
}

const getUser = cache(async (username: string, loggedInUser: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUser),
  });
  if (!user) notFound();
  return user;
});

export async function generateMetadata({
  params,
}: UserProfileProps): Promise<Metadata> {
  const { username } = await params;
  const session = await getServerSession();
  if (!session || !session.user) return {};
  const user = await getUser(username, session.user.id);
  return {
    title: `${user.displayUsername} (@${user.username})`,
  };
}

async function UserProfile({ params }: UserProfileProps) {
  const { username } = await params;
  const session = await getServerSession();
  if (!session || !session.user) {
    return (
      <p className="text-destructive">
        You are not authorized to view this page
      </p>
    );
  }
  const user = await getUser(username, session.user.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5"></div>
    </main>
  );
}

export default UserProfile;
