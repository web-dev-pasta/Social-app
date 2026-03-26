"use client";
import { useSession } from "./session-provider";

function App() {
  const session = useSession();
  console.log(session);

  return <div>App</div>;
}

export default App;
