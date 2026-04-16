import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/validation/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";
import { PostsPage } from "@/lib/types";

export function useUpdateProfileMutations() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { startUpload } = useUploadThing("imageUploader");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      image,
    }: {
      values: UpdateUserProfileValues;
      image?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        image && startUpload([image]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newImageUrl = uploadResult?.[0].serverData.image;
      const queryFilter: QueryFilters = {
        queryKey: ["posts-feed"],
      };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      image: newImageUrl || updatedUser.image,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );
      router.refresh();
    },
  });
  return mutation;
}
