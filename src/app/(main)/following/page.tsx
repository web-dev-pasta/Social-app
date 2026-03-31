import FollowingFeed from "../following-feed";
import PostEditor from "@/components/posts/editor/post-editor";
import TrendsSidebar from "@/components/trends-sidebar";
import ToggleFeeds from "../toggle-feeds";
export default function FollowingPage() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <div className="space-y-3">
          <ToggleFeeds />
          <FollowingFeed />
        </div>
      </div>
      <TrendsSidebar />
    </main>
  );
}
