"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { type PostsPage } from "@/lib/types";
import Post from "@/components/posts/post";
function ForYouFeed() {
  const fetchData = async () => {
    const result = await axios.get(`/api/posts/for-you`);
    return result.data;
  };
  const { data, isPending, isError } = useQuery<PostsPage>({
    queryKey: ["posts-feed", "for-you"],
    queryFn: fetchData,
  });
  console.log();

  if (isPending) {
    return <Loader2 className="mx-auto animate-spin" />;
  }
  if (isError) {
    return <p className="text-destructive text-center">An error occured!</p>;
  }
  return (
    <div className="space-y-5">
      {data?.posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
}

export default ForYouFeed;
