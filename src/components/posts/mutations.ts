import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./actions";

export function useDeletePost() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  return useMutation({
    mutationFn: deletePost,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["posts-feed"] });
      await queryClient.cancelQueries({ queryKey: ["post-feed"] });

      const previousPostsFeedQueries = queryClient.getQueriesData<
        InfiniteData<PostsPage, string | null>
      >({ queryKey: ["posts-feed"] });

      const previousPostFeedQueries = queryClient.getQueriesData<
        InfiniteData<PostsPage, string | null>
      >({ queryKey: ["post-feed"] });

      const previousQueries = [
        ...previousPostsFeedQueries,
        ...previousPostFeedQueries,
      ];

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        { queryKey: ["posts-feed"] },
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((p) => p.id !== id),
            })),
          };
        },
      );

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        { queryKey: ["post-feed"] },
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((p) => p.id !== id),
            })),
          };
        },
      );

      return { previousQueries };
    },
    onSuccess({ deletedPost }) {
      if (pathname.startsWith(`/posts`)) {
        router.push(`/users/${deletedPost.user.username}`);
      }
    },
    onError(_1, _2, context) {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
}
