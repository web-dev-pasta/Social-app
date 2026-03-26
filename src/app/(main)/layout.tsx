import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import SessionProvider from "./session-provider";
import Navbar from "@/components/navbar";

async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  return (
    <SessionProvider value={{ session, user: session.user }}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        {children}
      </div>
    </SessionProvider>
  );
}

export default Layout;
