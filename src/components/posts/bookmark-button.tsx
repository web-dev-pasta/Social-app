import { BookmarkInfo } from "@/lib/types";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({
  postId,
  initialState,
}: BookmarkButtonProps) {
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await axios.get(`/api/posts/${postId}/bookmark`);
      return result.data;
    },
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: async () =>
      data.isBookmarkedByUser
        ? await axios.delete(`/api/posts/${postId}/bookmark`)
        : await axios.post(`/api/posts/${postId}/bookmark`),
    onMutate: async () => {
      toast.success(`Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`);

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },
    onError(error, _, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    },
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={"size-5"}
        fill={data.isBookmarkedByUser ? `gold` : `none`}
        style={{ color: data.isBookmarkedByUser ? "gold" : undefined }}
      />
    </button>
  );
}
