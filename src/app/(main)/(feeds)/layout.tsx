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
    <div className="w-full min-w-0 space-y-3">
      <main className="flex w-full min-w-0 gap-5">
        <div className="w-full min-w-0 space-y-5">
          <PostEditor />
          <ToggleFeeds />
          <div className="space-y-3">{children}</div>
        </div>
        <TrendsSidebar />
      </main>
    </div>
  );
}

export default Layout;
