import Image from "next/image";
import avatarPlaceHolder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
interface UserAvatarProps {
  image?: string | null | undefined;
  size?: number;
  className?: string;
  loading?: "eager" | "lazy" | undefined;
}

function UserAvatar({ image, size, className, loading }: UserAvatarProps) {
  return (
    <Image
      src={image ?? avatarPlaceHolder}
      alt="avatar"
      width={size ?? 48}
      loading={loading || undefined}
      height={size ?? 48}
      sizes="20vh"
      className={cn(
        "bg-secondary aspect-square h-fit flex-none rounded-full object-cover select-none",
        className,
      )}
    />
  );
}

export default UserAvatar;
