import LogoutButton from "@/components/logout-button";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

async function Dashboard() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  return (
    <div>
      Dashboard {session.user.name}
      <LogoutButton />
    </div>
  );
}

export default Dashboard;
