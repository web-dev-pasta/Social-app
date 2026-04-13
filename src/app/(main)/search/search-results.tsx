"use client";

import InfiniteScrollContainer from "@/components/posts/infinite-scroll-container";
import PostsLoadingSkeleton from "@/components/posts/loading-skeleton";
import Post from "@/components/posts/post";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const router = useRouter();
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "search", query],
    queryFn: async ({ pageParam }): Promise<PostsPage> => {
      const { data } = await axios.get<PostsPage>("/api/search", {
        params: {
          q: query,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      });

      return data;
    },
    select: (data) => {
      return data?.pages.flatMap((page) => page.posts) || [];
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-muted-foreground text-center">
        No posts found for this query.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-destructive text-center">
        An error occurred while loading posts.
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
