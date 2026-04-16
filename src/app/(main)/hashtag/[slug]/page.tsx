import { Metadata } from "next";
import HashtagSinglePage from "./hashtag-single-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `#${slug}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">#{slug}</h1>
          <HashtagSinglePage slug={slug} />
        </div>
      </div>
    </main>
  );
}
