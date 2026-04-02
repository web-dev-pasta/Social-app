import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "./user-avatar";
import { formatNumber } from "@/lib/utils";
import { unstable_cache } from "next/cache";
import FollowButton from "./follow-button";
import UserTooltip from "./user-tooltip";

function TrendsSidebar() {
  return (
    <div className="sticky top-21 h-fit w-72 flex-none space-y-5 max-md:hidden lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

export default TrendsSidebar;

async function WhoToFollow() {
  const session = await getServerSession();
  const user = session?.user;
  if (!user) {
    return null;
  }

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      // followers: {
      //   none: {
      //     followerId: user.id,
      //   },
      // },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });
  return (
    <div className="bg-card space-y-5 rounded-2xl p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-2"
          >
            <UserAvatar image={user.image} size={40} />
            <div>
              <p className="line-clamp-1 font-semibold hover:underline">
                {user.displayUsername}
              </p>
              <p className="text-muted-foreground line-clamp-1">
                @{user.username}
              </p>
            </div>
          </Link>
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: !!user.followers.length,
            }}
          />
        </div>
      ))}
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
  SELECT hashtag, COUNT(*) AS count
  FROM (
    SELECT DISTINCT p.id, LOWER(m[1]) AS hashtag
    FROM post p
    CROSS JOIN LATERAL regexp_matches(
      p.content,
      '(#[A-Za-z0-9_ء-ي]+)',
      'g'
    ) AS m
  ) t
  GROUP BY hashtag
  ORDER BY count DESC, hashtag ASC
  LIMIT 5
`;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="bg-card space-y-5 rounded-2xl p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              dir="auto"
              className="line-clamp-1 font-semibold break-all hover:underline"
              title={hashtag}
            >
              {hashtag}{" "}
              <span className="text-muted-foreground text-sm font-normal">
                - {formatNumber(count)} {count === 1 ? "post" : "posts"}
              </span>
            </p>
          </Link>
        );
      })}
    </div>
  );
}
