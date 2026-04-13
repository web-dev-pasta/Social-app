"use client";

import InfiniteScrollContainer from "@/components/posts/infinite-scroll-container";
import PostsLoadingSkeleton from "@/components/posts/loading-skeleton";
import Post from "@/components/posts/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

const fetchHashtagPosts = async ({
  pageParam,
  slug,
}: {
  pageParam: string | null;
  slug: string;
}) => {
  const result = await axios.get(
    `/api/posts/hashtag/${encodeURIComponent(slug)}`,
    {
      params: pageParam ? { cursor: pageParam } : {},
    },
  );

  return result.data;
};

interface HashtagSinglePageProps {
  slug: string;
}

export default function HashtagSinglePage({ slug }: HashtagSinglePageProps) {
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "hashtag", slug],
    queryFn: ({ pageParam }) => fetchHashtagPosts({ pageParam, slug }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => data.pages.flatMap((page) => page.posts),
  });

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-muted-foreground text-center">
        No posts for <span className="font-semibold">#{slug}</span> yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-destructive text-center">
        An error occurred while loading posts for #{slug}.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onReachButtom={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
