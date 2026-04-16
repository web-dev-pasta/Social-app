import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import SessionProvider from "./session-provider";
import Navbar from "@/components/navbar";
import MenuBar from "./menu-bar";
import TrendsSidebar from "@/components/trends-sidebar";

async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  return (
    <SessionProvider value={{ session, user: session.user }}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <MenuBar className="bg-card sticky top-21 h-fit flex-none space-y-3 rounded-2xl px-3 py-5 shadow-sm max-sm:hidden lg:px-5 xl:w-80" />
          <div className="w-full min-w-0">
            <main className="h-full w-full min-w-0">{children}</main>
          </div>
        </div>
        <MenuBar className="bg-card sticky bottom-0 flex w-full justify-center gap-5 border-t p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
}

export default Layout;
