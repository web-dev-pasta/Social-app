import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

interface ChatChannelProps {
  open: boolean;
  openSidebar: () => void;
}

export default function ChatChannel({ open, openSidebar }: ChatChannelProps) {
  return (
    <div className={cn("h-full w-full md:block", !open && "hidden")}>
      <Channel
        EmptyPlaceholder={
          <div className="flex h-full items-center justify-center p-6 text-center">
            <div className="border-border bg-background/80 max-w-md space-y-4 rounded-3xl border p-8 shadow-sm">
              <p className="text-xl font-semibold">Welcome to Messages</p>
              <p className="text-muted-foreground">
                No conversation is open yet. Select an existing chat from the
                sidebar or start a new one.
              </p>
            </div>
          </div>
        }
      >
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

function CustomChannelHeader({
  openSidebar,
  ...props
}: CustomChannelHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
}
