import FollowButton from "@/components/follow-button";
import FollowerCount from "@/components/follower-count";
import TrendsSidebar from "@/components/trends-sidebar";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { username } from "better-auth/plugins";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPostsFeed from "./postsFeed";
import Linkify from "@/components/linkify";

interface UserProfilePageProps {
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
}: UserProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const session = await getServerSession();
  if (!session || !session.user) return {};
  const user = await getUser(username, session.user.id);
  return {
    title: `${user.displayUsername} (@${user.username})`,
  };
}

async function UserProfilePage({ params }: UserProfilePageProps) {
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
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={session.user.id} />
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayUsername}'s posts
          </h2>
          <UserPostsFeed user={user} />
        </div>
      </div>
    </main>
  );
}

export default UserProfilePage;

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };
  return (
    <div className="bg-card h-fit w-full space-y-5 rounded-2xl p-5 shadow-sm">
      <UserAvatar
        image={user.image}
        loading="eager"
        size={250}
        className="mx-auto aspect-square size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayUsername}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button>Edit profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden wrap-break-word whitespace-pre-line">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
