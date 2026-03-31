import PostEditor from "@/components/posts/editor/post-editor";
import ForYouFeed from "./for-you-feed";
import ToggleFeeds from "./toggle-feeds";
import TrendsSidebar from "@/components/trends-sidebar";

export default function HomePage() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <div className="space-y-3">
          <ToggleFeeds />
          <ForYouFeed />
        </div>
      </div>
      <TrendsSidebar />
    </main>
  );
}
