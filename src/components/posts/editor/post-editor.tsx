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
import useMediaUpload, { Attachment } from "./use-media-upload";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

function PostEditor() {
  const textInputRef = useRef("");
  const htmlInputRef = useRef("");
  const [isEmpty, setIsEmpty] = useState(true);
  const mutation = useSubmitPostMutation();
  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload();

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

  const hasPendingUploads = attachments.some(
    (attachment) => attachment.isUploading || !attachment.mediaId,
  );

  const onSubmit = async () => {
    try {
      const result = await mutation.mutateAsync(
        {
          toSubmitInput: htmlInputRef.current,
          textInput: textInputRef.current,
          mediaIds:
            attachments
              ?.map((a) => a.mediaId)
              .filter((id): id is string => Boolean(id)) ?? [],
        },
        {
          onSuccess() {
            editor?.commands.clearContent();
            resetMediaUploads();
          },
        },
      );
      if (result.success) {
        return toast.success(result.message);
      }
    } catch (err) {
      toast.error((err as Error).message);
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
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Spinner />
          </>
        )}
        <AddAttachmentsButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          disabled={
            (isEmpty && !attachments.length) || 
            mutation.isPending ||
            isUploading ||
            hasPendingUploads
          }
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

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

function AddAttachmentsButton({
  onFilesSelected,
  disabled,
}: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}
interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
}

function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

function AttachmentPreview({
  attachment: { file, mediaId, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="attachment-preview"
          width={500}
          height={500}
          className="size-fit max-h-120 rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-120 rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="bg-foreground text-background hover:bg-foreground/60 absolute top-3 right-3 rounded-full p-1.5 transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
