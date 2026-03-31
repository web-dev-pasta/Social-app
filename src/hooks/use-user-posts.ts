import { PostData, PostsPage } from "@/lib/types";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
export const useUserPosts = (userId: string) => {
  const fetchData = async ({
    pageParam,
  }: {
    pageParam: string | null | unknown;
  }) => {
    const result = await axios.get(
      `/api/users/${userId}/posts?${pageParam ? `cursor=${pageParam}` : ``}`,
    );
    return result.data;
  };
  const getQueryOptions = infiniteQueryOptions<
    PostsPage,
    AxiosError,
    PostData[]
  >({
    queryKey: ["posts-feed", "user-posts", userId],
    queryFn: fetchData,
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
    refetchOnWindowFocus: false,
    select: (data) => data.pages.flatMap((page) => page.posts),
  });
  const query = useInfiniteQuery({
    ...getQueryOptions,
  });

  return query;
};
