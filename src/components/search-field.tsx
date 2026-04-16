"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function SearchField() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) {
      return;
    }
    if (q === searchParams.get("q")) {
      queryClient.invalidateQueries();
    } else {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }
  return (
    <form onSubmit={handleSubmit} action="/search" method="GET">
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10" />
        <SearchIcon className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
      </div>
    </form>
  );
}

export default SearchField;
