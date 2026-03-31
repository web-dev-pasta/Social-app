"use client";

import { Loader2 } from "lucide-react";
import Post from "@/components/posts/post";
import PostsLoadingSkeleton from "@/components/posts/loading-skeleton";
import InfiniteScrollContainer from "@/components/posts/infinite-scroll-container";
import { useUserPosts } from "@/hooks/use-user-posts";
import { UserData } from "@/lib/types";
interface UserPostsFeedProps {
  user: UserData;
}
function UserPostsFeed({ user }: UserPostsFeedProps) {
  const {
    data,
    isPending,
    isError,
    hasNextPage,
    error,
    fetchNextPage,
    isFetchingNextPage,
  } = useUserPosts(user.id);

  if (isPending) {
    return <PostsLoadingSkeleton />;
  }
  if (data?.length === 0) {
    return (
      <p className="text-muted-foreground text-center text-pretty">
        @{user.displayUsername} has not posted any posts yet
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
        <div className="text-muted-foreground text-center">No more posts</div>
      )}
    </InfiniteScrollContainer>
  );
}

export default UserPostsFeed;
