"use client";

import { Loader2 } from "lucide-react";
import Post from "@/components/posts/post";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import PostsLoadingSkeleton from "@/components/posts/loading-skeleton";
import Link from "next/link";
import { usePosts } from "@/hooks/use-posts";
import InfiniteScrollContainer from "@/components/posts/infinite-scroll-container";
import { toast } from "sonner";
function ForYouFeed() {
  const {
    data,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts();

  if (isPending) {
    return <PostsLoadingSkeleton />;
  }
  if (data?.length === 0) {
    return (
      <p className="text-muted-foreground text-center text-pretty">
        No friends have added any posts yet
      </p>
    );
  }

  if (isError) {
    return <p className="text-destructive text-center">{error.message}</p>;
  }

  return (
    <InfiniteScrollContainer
      onReachButtom={() => hasNextPage && fetchNextPage()}
      className="space-y-5"
    >
      {data?.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
      {!hasNextPage && data.length > 0 && (
        <div className="bg-card space-y-3 rounded p-10 text-center shadow-sm">
          <div className="posts space-y-2">
            <p className="text-xl font-bold">No more posts</p>
            <p className="text-muted-foreground">
              Add more friends to see more posts in your feed
            </p>
          </div>
          <Button asChild>
            <Link href="/">Find Friends</Link>
          </Button>
        </div>
      )}
    </InfiniteScrollContainer>
  );
}

export default ForYouFeed;
