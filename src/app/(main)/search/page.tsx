import TrendsSidebar from "@/components/trends-sidebar";
import { Metadata } from "next";
import SearchResults from "./search-results";
import { redirect } from "next/navigation";

export async function generateMetadata({
  searchParams,
}: any): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: `Search results for "${q}"`,
  };
}

export default async function Page({ searchParams }: any) {
  const { q } = await searchParams;
  if (!q) {
    redirect("/for-you");
  }

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">
            Search results for &quot;{q}&quot;
          </h1>
          <SearchResults query={q} />
        </div>
      </div>
    </main>
  );
}
