import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import ToggleFeeds from "../toggle-feeds";

async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-3">
      <ToggleFeeds />
      {children}
    </div>
  );
}

export default Layout;
