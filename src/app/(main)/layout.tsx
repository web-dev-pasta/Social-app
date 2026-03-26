import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import SessionProvider from "./session-provider";

async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  return (
    <SessionProvider value={{ session, user: session.user }}>
      {children}
    </SessionProvider>
  );
} 

export default Layout;
