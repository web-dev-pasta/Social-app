import { type Post } from "@/generated/prisma/client";
import { PostData } from "@/lib/types";
import parse from "html-react-parser";

interface PostProps {
  post: PostData;
}

function Post({ post }: PostProps) {
  return <article className="wrap-break-word hyphens-auto"></article>;
}

export default Post;
/**
 * {parse(post.content)}
      <p>Author : {post.user.displayUsername}</p>
      <hr />
 * 
 */
