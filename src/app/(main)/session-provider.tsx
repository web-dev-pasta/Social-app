"use client";

import { Session } from "@/lib/auth";
import { User } from "@/lib/auth";
import { createContext, useContext } from "react";

interface SessionContext {
  user: User;
  session: Session;
}

const SessionContext = createContext<SessionContext | null>(null);
function SessionProvider({
  value,
  children,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export default SessionProvider;

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a Session Porivder");
  }
  return context;
}
