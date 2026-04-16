import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { MailPlus, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type BaseSyntheticEvent,
} from "react";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import { useSession } from "../session-provider";
import useDebounce from "@/hooks/use-debounce";
import NewChatDialog from "./new-chat-dialog";

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ open, onClose }: ChatSidebarProps) {
  const { user } = useSession();

  const queryClient = useQueryClient();

  const { channel, client } = useChatContext();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchParamsRef = useRef<{
    params: any;
    query: string;
  } | null>(null);

  const handleChannelSearch = useCallback(
    async (params: any, event: BaseSyntheticEvent) => {
      const query = event?.target?.value?.toString() ?? "";
      params.setQuery(query);
      setSearchQuery(query);
      searchParamsRef.current = { params, query };

      if (!query.trim()) {
        params.setResults([]);
        params.setSearching(false);
      }
    },
    [],
  );

  useEffect(() => {
    const current = searchParamsRef.current;
    const query = debouncedSearchQuery;
    if (!current) return;

    const { params } = current;

    if (!query.trim() || !client || !user?.id) {
      params.setResults([]);
      params.setSearching(false);
      return;
    }

    let canceled = false;

    params.setSearching(true);

    (async () => {
      try {
        const channels = await queryClient.fetchQuery({
          queryKey: ["stream-channel-search", query],
          queryFn: async () =>
            (client as any).queryChannels(
              {
                type: "messaging",
                members: { $in: [user.id] },
                name: { $autocomplete: query },
              },
              { last_message_at: -1 },
              { state: true, presence: true, limit: 15 },
            ),
          staleTime: 1000 * 60 * 2,
        });

        if (canceled || searchParamsRef.current?.query !== query) return;
        params.setResults(channels);
      } catch (error) {
        if (canceled) return;
        console.error("Channel search failed", error);
        params.setResults([]);
      } finally {
        if (!canceled && searchParamsRef.current?.query === query) {
          params.setSearching(false);
        }
      }
    })();

    return () => {
      canceled = true;
    };
  }, [client, queryClient, user?.id, debouncedSearchQuery]);

  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
    }
  }, [channel?.id, queryClient]);

  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose],
  );

  const dedupeChannels = useCallback((channels: any[]) => {
    const seen = new Set<string>();
    return channels.filter((channel) => {
      const cid = channel?.cid;
      if (!cid) return true;
      if (seen.has(cid)) return false;
      seen.add(cid);
      return true;
    });
  }, []);

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user.id] },
        }}
        channelRenderFilterFn={dedupeChannels}
        setActiveChannelOnMount={false}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchForUsers: false,
          searchFunction: handleChannelSearch,
          searchQueryParams: {
            channelFilters: {
              filters: { members: { $in: [user.id] } },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
}

interface MenuHeaderProps {
  onClose: () => void;
}

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 p-2 max-md:h-21.5">
        <div className="md:hidden">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
        <Button
          size="icon"
          variant="ghost"
          title="Start new chat"
          onClick={() => setShowNewChatDialog(true)}
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {showNewChatDialog && (
        <NewChatDialog
          onOpenChange={setShowNewChatDialog}
          onChatCreated={() => {
            setShowNewChatDialog(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
