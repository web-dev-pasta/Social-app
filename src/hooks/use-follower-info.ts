import axios from "axios";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo,
) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: async () => {
      const res = await axios.get<FollowerInfo>(
        `/api/users/${userId}/followers`,
      );
      return res.data;
    },
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
