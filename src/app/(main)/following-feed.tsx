"use client";

import { Loader2 } from "lucide-react";
import Post from "@/components/posts/post";
import { Button } from "@/components/ui/button";
import PostsLoadingSkeleton from "@/components/posts/loading-skeleton";
import Link from "next/link";
import InfiniteScrollContainer from "@/components/posts/infinite-scroll-container";
import { useFollowingPosts } from "@/hooks/use-following-posts";
function FollowingFeed() {
  const {
    data,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFollowingPosts();

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
        <p className="text-muted-foreground text-center">End of posts</p>
      )}
    </InfiniteScrollContainer>
  );
}

export default FollowingFeed;
