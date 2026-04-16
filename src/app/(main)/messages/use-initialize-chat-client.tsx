import axios from "axios";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useSession } from "../session-provider";

export default function useInitializeChatClient() {
  const { user } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    if (!user) return;

    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    client
      .connectUser(
        {
          id: user.id,
          username: user.username || undefined,
          name: user.displayUsername || user.name,
          image: user.image || undefined,
        },
        async () => {
          const res = await axios.get("/api/get-token");
          return res.data.token;
        },
      )
      .then(() => setChatClient(client))
      .catch((error) => console.error("Failed to connect user", error));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .then(() => console.log("Connection closed"))
        .catch((error) => console.error("Failed to disconnect user", error));
    };
  }, [
    user?.id,
    user?.username,
    user?.name,
    user?.displayUsername,
    user?.image,
  ]);

  return chatClient;
}
