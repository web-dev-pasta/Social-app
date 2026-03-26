"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/app/(main)/session-provider";
import UserAvatar from "./user-avatar";
import { LogOut, UserIcon } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

interface UserButtonProps {
  className?: string;
}
const handleLogout = async () => {
  await authClient.signOut();
  redirect("/login");
};
function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none">
          <UserAvatar image={user.image} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            Logged in as @{user.name.slice(0, 7)}
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link
              href={`/users/${user.name}`}
              className="flex items-center gap-2"
            >
              <span>Profile</span>
              <UserIcon />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <span>Log out</span>
            <LogOut />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
