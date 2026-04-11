import { CommentsPage, PostData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import CommentInput from "./comment-input";
import Comment from "./comment";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
  const fetchComments = async ({ pageParam }: { pageParam: string | null }) => {
    const result = await axios.get(`/api/posts/${post.id}/comments`, {
      params: pageParam ? { cursor: pageParam } : {},
    });
    return result.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: fetchComments,
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-muted-foreground text-center">No comments yet.</p>
      )}
      {status === "error" && (
        <p className="text-destructive text-center">
          An error occurred while loading comments.
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
