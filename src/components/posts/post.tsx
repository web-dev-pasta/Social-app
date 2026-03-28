import { type Post } from "@/generated/prisma/client";
import { PostData } from "@/lib/types";
import parse from "html-react-parser";
import Link from "next/link";
import UserAvatar from "../user-avatar";
import { formatRelativeDate } from "@/lib/utils";

interface PostProps {
  post: PostData;
}

function Post({ post }: PostProps) {
  const user = post.user;
  return (
    <article className="bg-card space-y-3 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Link href={`/users/${user.username}`}>
          <UserAvatar image={user.image} size={40} />
        </Link>
        <div>
          <Link
            href={`/users/${user.username}`}
            className="block font-medium hover:underline"
          >
            {user.displayUsername}
          </Link>
          <Link
            href={`/posts/${post.id}`}
            className="text-muted-foreground block text-sm hover:underline"
          >
            {formatRelativeDate(new Date(post.createdAt))}
          </Link>
        </div>
      </div>
      <div className="wrap-break-word hyphens-auto">{parse(post.content)}</div>
    </article>
  );
}

export default Post;
/**
 * 
      <p>Author : {post.user.displayUsername}</p>
      <hr />
 * 
 */
