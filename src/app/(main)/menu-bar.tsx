import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bookmark, Flame, Mail, Users } from "lucide-react";
import { getServerSession } from "@/lib/get-session";
import streamServerClient from "@/lib/stream";
import MessagesButton from "./messages-button";
import React from "react";
import { SearchField, SearchFieldMobile } from "@/components/search-field";
interface MenuBarProps {
  className?: string;
}

const menuItems = [
  {
    href: "/for-you",
    label: "For You",
    icon: Flame,
  },
  {
    href: "/following",
    label: "Following",
    icon: Users,
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

async function MenuBar({ className }: MenuBarProps) {
  const session = await getServerSession();

  if (!session || !session.user) return null;
  const { user } = session;
  let unreadMessagesCount = 0;

  try {
    const res = await streamServerClient.getUnreadCount(user.id);
    unreadMessagesCount = res.total_unread_count;
  } catch (error) {
    console.error("Stream error:", error);
  }

  return (
    <div className={className}>
      {menuItems.map((item) => {
        const Icon = item?.icon;

        return (
          <React.Fragment key={item.label}>
            {item.href === `/messages` ? (
              <MessagesButton
                initialState={{ unreadCount: unreadMessagesCount }}
              />
            ) : (
              <Button
                variant="ghost"
                className="relative flex items-center justify-start gap-3"
                title={item.label}
                asChild
              >
                <Link href={item.href}>
                  <Icon />
                  <span className="max-lg:hidden">{item.label}</span>
                </Link>
              </Button>
            )}
          </React.Fragment>
        );
      })}
      <div className="sm:hidden">
        <SearchField>
          <SearchFieldMobile />
        </SearchField>
      </div>
    </div>
  );
}

export default MenuBar;
