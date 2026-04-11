"use client";
import { Media, type Post } from "@/generated/prisma/client";
import { PostData } from "@/lib/types";
import parse from "html-react-parser";
import Link from "next/link";
import UserAvatar from "../user-avatar";
import { cn, formatRelativeDate } from "@/lib/utils";
import DeletePost from "./delete-post-button";
import { useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/app/(main)/session-provider";
import Linkify from "../linkify";
import UserTooltip from "../user-tooltip";
import Image from "next/image";
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
            <UserTooltip user={user}>
              <Link href={`/users/${user.username}`}>
                <UserAvatar image={user.image} size={40} />
              </Link>
            </UserTooltip>
            <div>
              <UserTooltip user={user}>
                <Link
                  href={`/users/${user.username}`}
                  className="block font-medium hover:underline"
                >
                  {user.displayUsername}
                </Link>
              </UserTooltip>
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
        <Linkify>
          <div className="wrap-break-word hyphens-auto">{parsedContent}</div>
        </Linkify>
        {!!post.attachments.length && (
          <MediaPreviews attachments={post.attachments} />
        )}
      </article>
    </div>
  );
}

export default Post;

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-120 rounded-2xl"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-120 rounded-2xl"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}
