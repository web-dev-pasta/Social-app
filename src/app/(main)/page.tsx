import PostEditor from "@/components/posts/editor/post-editor";
import Post from "@/components/posts/post";
import TrendsSidebar from "@/components/trends-sidebar";
import { prisma } from "@/lib/prisma";

async function App() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayUsername: true,
          image: true,
        },
      },
    },
  });
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
      <TrendsSidebar />
    </main>
  );
}

export default App;
