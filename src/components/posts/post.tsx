"use client";
import { type Post } from "@/generated/prisma/client";
import { PostData } from "@/lib/types";
import parse from "html-react-parser";
import Link from "next/link";
import UserAvatar from "../user-avatar";
import { formatRelativeDate } from "@/lib/utils";
import DeletePost from "./delete-post-button";
import { useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/app/(main)/session-provider";
interface PostProps {
  post: PostData;
}

function Post({ post }: PostProps) {
  const user = post.user;
  const { user: currentUser } = useSession();
  // const [relativeTime, setRelativeTime] = useState(
  //   formatRelativeDate(new Date(post.createdAt)),
  // );

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setRelativeTime(formatRelativeDate(new Date(post.createdAt)));
  //   }, 1000 * 5);

  //   return () => clearInterval(interval);
  // }, [post.createdAt]);
  const parsedContent = useMemo(() => parse(post.content), [post.content]);

  return (
    <div>
      <article className="bg-background space-y-3 rounded-2xl p-5 shadow-sm">
        <header className="flex items-center justify-between">
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
                {/* {relativeTime} */}
              </Link>
            </div>
          </div>
          {user.id === currentUser.id && <DeletePost user={user} post={post} />}
        </header>

        <div className="wrap-break-word hyphens-auto">{parsedContent}</div>
      </article>
    </div>
  );
}

export default Post;
