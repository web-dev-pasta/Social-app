import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import ToggleFeeds from "../toggle-feeds";
import PostEditor from "@/components/posts/editor/post-editor";
import TrendsSidebar from "@/components/trends-sidebar";

async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen gap-5">
      <div className="flex w-full min-w-0 flex-col gap-3">
        <div className="w-full min-w-0 space-y-5">
          <PostEditor />
          <ToggleFeeds />
        </div>
        {children}
      </div>
      <TrendsSidebar />
    </div>
  );
}

export default Layout;
