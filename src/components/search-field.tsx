"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

interface ContextProps {
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const HandleSubmitContext = createContext<ContextProps | null>(null);

function SearchField({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get("q") as string)?.trim();

    if (!q) return;
    setOpen(false);

    if (q === searchParams.get("q")) {
      queryClient.invalidateQueries();
    } else {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }
  return (
    <HandleSubmitContext.Provider value={{ handleSubmit, open, setOpen }}>
      <form onSubmit={handleSubmit} action="/search" method="GET">
        {children}
      </form>
    </HandleSubmitContext.Provider>
  );
}

function SearchFieldLaptop() {
  return (
    <div className="relative flex h-full items-center max-sm:hidden">
      <Input name="q" placeholder="Search" className="pe-10" />
      <SearchIcon className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
    </div>
  );
}
function SearchFieldMobile() {
  const handleSubmit = useContext(HandleSubmitContext)?.handleSubmit;
  const open = useContext(HandleSubmitContext)?.open;
  const setOpen = useContext(HandleSubmitContext)?.setOpen;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search-icon lucide-search"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:hidden">
        <form
          onSubmit={handleSubmit}
          action="/search"
          method="GET"
          className="space-y-3"
        >
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Search</h4>
            <p className="text-muted-foreground text-sm">
              Type the text you want to search for.
            </p>
          </div>
          <div className="flex gap-2">
            <Input name="q" placeholder="Search" />
            <Button type="submit">search</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export { SearchField, SearchFieldLaptop, SearchFieldMobile };
