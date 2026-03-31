"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ToggleFeeds() {
  const pathName = usePathname();
  return (
    <div className="flex items-center gap-5 rounded-md p-2 shadow *:flex-1">
      <Button asChild variant={pathName === "/" ? "secondary" : "ghost"}>
        <Link href={`/`}>For You</Link>
      </Button>
      <Button
        asChild
        variant={pathName === "/following" ? "secondary" : "ghost"}
      >
        <Link href={`/following`}>Following</Link>
      </Button>
    </div>
  );
}

export default ToggleFeeds;
