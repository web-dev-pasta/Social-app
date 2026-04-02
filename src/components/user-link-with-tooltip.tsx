"use client";

import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { PropsWithChildren } from "react";
import UserTooltip from "./user-tooltip";

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: string;
}

export default function UserLinkWithTooltip({
  children,
  username,
}: UserLinkWithTooltipProps) {
  const fetchUser = async () => {
    const result = await axios.get(`/api/users/username/${username}`);
    return result.data;
  };
  const { data } = useQuery({
    queryKey: ["user-data", username],
    queryFn: fetchUser,
    retry(failureCount, error) {
      if (error instanceof AxiosError && error.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip user={data}>
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserTooltip>
  );
}
