import PostEditor from "@/components/posts/editor/post-editor";
import Post from "@/components/posts/post";
import { prisma } from "@/lib/prisma";

async function App() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          displayUsername: true,
          image: true,
        },
      },
    },
  });
  return (
    <main className="w-full min-w-0">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </main>
  );
}

export default App;
