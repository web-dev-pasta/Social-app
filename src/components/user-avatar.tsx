import Image from "next/image";
import avatarPlaceHolder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
interface UserAvatarProps {
  image?: string | null | undefined;
  size?: number;
  className?: string;
}

function UserAvatar({ image, size, className }: UserAvatarProps) {
  return (
    <Image
      src={image ?? avatarPlaceHolder}
      alt="avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "bg-secondary aspect-square h-fit flex-none rounded-full object-cover select-none",
        className,
      )}
    />
  );
}

export default UserAvatar;
