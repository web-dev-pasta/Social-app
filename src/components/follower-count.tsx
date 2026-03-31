"use client";
import useFollowerInfo from "@/hooks/use-follower-info";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import React from "react";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

function FollowerCount({ userId, initialState }: FollowerCountProps) {
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
}

export default FollowerCount;
