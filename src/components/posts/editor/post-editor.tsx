"use client";
import { useSession } from "@/app/(main)/session-provider";
import UserAvatar from "@/components/user-avatar";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";
import { useRef, useState } from "react";

import "./styles.css";
import LoadingButton from "@/components/loading-button";
import { toast } from "sonner";
import { useSubmitPostMutation } from "./mutations";

function PostEditor() {
  const textInputRef = useRef("");
  const htmlInputRef = useRef("");
  const [isEmpty, setIsEmpty] = useState(true);
  const mutation = useSubmitPostMutation();

  const { user } = useSession();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: user.displayUsername
          ? `What's on your mind, ${user.displayUsername[0].toUpperCase() + user.displayUsername.slice(1)}?`
          : "Write what you think about...",
      }),
    ],
    textDirection: "auto",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const text = editor.getText({ blockSeparator: "\n" });

      textInputRef.current = text;
      htmlInputRef.current = editor.getHTML();

      setIsEmpty(!text.trim());
    },
  });

  const onSubmit = async () => {
    try {
      const result = await mutation.mutateAsync(
        {
          toSubmitInput: htmlInputRef.current,
          textInput: textInputRef.current,
        },
        {
          onSuccess() {
            editor?.commands.clearContent();
          },
        },
      );
      if (result.success) {
        return toast.success(result.message);
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
    }
  };

  return (
    <div className="bg-card flex flex-col gap-5 rounded-2xl p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar image={user.image} className="max-sm:hidden" />
        <EditorContent
          editor={editor}
          className="dark:bg-background max-h-57 w-full overflow-y-auto rounded-2xl bg-gray-100 px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <LoadingButton
          disabled={isEmpty || mutation.isPending}
          onClick={onSubmit}
          title="Post"
          type="submit"
          isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  );
}

export default PostEditor;
