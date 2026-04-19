"use client";
import { Media, type Post } from "@/generated/prisma/client";
import { PostData } from "@/lib/types";
import parse from "html-react-parser";
import Link from "next/link";
import UserAvatar from "../user-avatar";
import { cn, formatRelativeDate } from "@/lib/utils";
import DeletePost from "./delete-post-button";
import { useMemo, useState } from "react";
import { useSession } from "@/app/(main)/session-provider";
import Linkify from "../linkify";
import UserTooltip from "../user-tooltip";
import Image from "next/image";
import LikeButton from "./like-button";
import BookmarkButton from "./bookmark-button";
import { MessageSquare, Pin } from "lucide-react";
import Comments from "../comments/comments";
import { usePathname } from "next/navigation";
interface PostProps {
  post: PostData;
}

function Post({ post }: PostProps) {
  const user = post.user;
  const { user: currentUser } = useSession();
  const pathName = usePathname();
  const [showComments, setShowComments] = useState(
    pathName.startsWith(`/posts`) ? true : false,
  );
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
      <article className="bg-background space-y-3 rounded-2xl border p-5 shadow-sm">
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
                // suppressHydrationWarning
              >
                {formatRelativeDate(new Date(post.createdAt))}
                {/* {relativeTime} */}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {post.pinned && pathName.startsWith("/for-you") && (
              <div className="text-muted-foreground flex items-center gap-0.5">
                <Pin size="20" />
                <span>Pinned Post</span>
              </div>
            )}

            {user.id === currentUser.id && (
              <DeletePost user={user} post={post} />
            )}
          </div>
        </header>
        <Linkify>
          <div className="wrap-break-word hyphens-auto">{parsedContent}</div>
        </Linkify>
        {!!post.attachments.length && (
          <MediaPreviews attachments={post.attachments} />
        )}
        <hr className="text-muted-foreground" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <LikeButton
              postId={post.id}
              initialState={{
                likes: post._count.likes,
                isLikedByUser: post.likes.length > 0,
              }}
            />
            <CommentButton
              post={post}
              onClick={() => setShowComments((prev) => !prev)}
            />
          </div>
          <BookmarkButton
            postId={post.id}
            initialState={{
              isBookmarkedByUser: post.bookmarks.length > 0,
            }}
          />
        </div>
        {showComments && <Comments post={post} />}
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

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}{" "}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
