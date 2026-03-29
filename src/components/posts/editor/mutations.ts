import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "./actions";
import { PostsPage } from "@/lib/types";

export function useSubmitPostMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async ({ newPost }) => {
      await queryClient.cancelQueries({
        queryKey: ["posts-feed", "for-you"],
      });
      queryClient.setQueryData<InfiniteData<PostsPage, string | null>>(
        ["posts-feed", "for-you"],

        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );
    },
  });
  return mutation;
}
