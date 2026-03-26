"use client";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface MenuBarProps {
  className?: string;
}

const menuItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/messages",
    label: "Messages",
    icon: Mail,
  },
  {
    href: "/bookmarks",
    label: "Bookmarks",
    icon: Bookmark,
  },
];

function MenuBar({ className }: MenuBarProps) {
  return (
    <div className={className}>
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <Button
            key={item.label}
            variant="ghost"
            className="flex items-center justify-start gap-3"
            title={item.label}
            asChild
          >
            <Link href={item.href}>
              <Icon />
              <span className="max-lg:hidden">{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}

export default MenuBar;
