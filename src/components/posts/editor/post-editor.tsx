"use client";
import { useSession } from "@/app/(main)/session-provider";
import UserAvatar from "@/components/user-avatar";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";
import { submitPost } from "./actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTransition } from "react";

import "./styles.css";
import LoadingButton from "@/components/loading-button";
import { toast } from "sonner";

function PostEditor() {
  const [input, setInput] = useState("");
  const [isSubmitting, startTransition] = useTransition();

  const { user } = useSession();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write what you think about...",
      }),
    ],
    textDirection: "auto",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const text = editor.getText({
        blockSeparator: "\n",
      });
      setInput(text);
    },
  });
  const onSubmit = () => {
    startTransition(async () => {
      const result = await submitPost(input);
      if (result?.error) {
        toast.error(result.message);
      }
      if (result?.success) {
        toast.success(result.message);
      }
      editor?.commands.clearContent();
    });
  };

  return (
    <div className="bg-card flex max-w-2xl flex-col gap-5 rounded-2xl p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar image={user.image} className="max-sm:hidden" />
        <EditorContent
          editor={editor}
          className="dark:bg-background max-h-57 w-full overflow-y-auto rounded-2xl bg-gray-100 px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <LoadingButton
          disabled={!input.trim() || isSubmitting}
          onClick={onSubmit}
          title="Post"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default PostEditor;
