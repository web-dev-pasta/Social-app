import { PostData, PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
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
    async onSuccess({ deletedPost }) {
      const queryFilter: QueryFilters = {
        queryKey: ["posts-feed"],
      };

      await queryClient.cancelQueries({
        queryKey: ["posts-feed"],
      });
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,

        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((p) => p.id !== deletedPost.id),
            })),
          };
        },
      );
      if (pathname.startsWith(`/posts`)) {
        router.push(`/users/${deletedPost.user.username}`);
      }
    },
  });
}
