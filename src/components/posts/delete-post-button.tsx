"use client";
import { type Post } from "@/generated/prisma/client";
import { PostData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MessageSquare,
  Scroll,
  ThumbsUp,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { deletePost } from "./actions";
import { useCallback } from "react";

interface DeletePostProps {
  post: PostData;
  user: {
    id: string;
    username: string | null;
    displayUsername: string | null;
    image: string | null;
  };
}
function DeletePost({ post, user }: DeletePostProps) {
  const [confirm, setConfirm] = useState("");
  const [step, setStep] = useState(1);
  const handleDelete = useCallback(async (id: Post["id"]) => {
    const result = await deletePost(id);
    console.log(result);
  }, []);
  const handleTextChange = useCallback((value: string) => {
    setConfirm(value);
  }, []);
  const handleNextStep = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, 3));
  }, []);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setStep(1);
          setConfirm("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="relative">
          <DialogTitle>Delete {user.displayUsername}'s post</DialogTitle>
          <DialogDescription aria-describedby={undefined} />
          <div className="absolute -bottom-2 -left-4 w-[calc(100%+32px)] border-t" />
        </DialogHeader>
        {step === 1 ? (
          <DeleteStepOne user={user} />
        ) : step === 2 ? (
          <DeleteStepTwo />
        ) : (
          <DeleteStepThree handleTextChange={handleTextChange} text={confirm} />
        )}
        <DialogFooter>
          {step === 3 ? (
            <DialogClose asChild>
              <Button
                variant="destructive"
                disabled={confirm.toLowerCase() !== "delete"}
                onClick={() => handleDelete(post.id)}
                className="text-destructive w-full max-sm:whitespace-normal"
              >
                Delete this post
              </Button>
            </DialogClose>
          ) : (
            <Button
              variant="outline"
              className={`w-full max-sm:whitespace-normal ${step === 2 && `max-sm:py-7`}`}
              onClick={handleNextStep}
            >
              {step === 1
                ? "I want to delete this post"
                : "I have read and understand these effects"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeletePost;
function DeleteStepOne({
  user,
  className,
  size,
  children,
}: {
  children?: ReactNode;
  className?: string;
  size?: number;
  user?: {
    id: string;
    username: string | null;
    displayUsername: string | null;
    image: string | null;
  };
}) {
  return (
    <>
      <div className="relative flex flex-col gap-3 py-4">
        <div className="space-y-2 text-center">
          <Scroll className="mx-auto" />
          <p className={cn("text-2xl font-bold", className)}>
            Delete {user?.displayUsername}'s post
          </p>
        </div>

        <div className="details flex items-center justify-center gap-3">
          <div className="flex items-center gap-3">
            0 <MessageSquare size={size ?? 20} />
          </div>
          <div className="flex items-center gap-3">
            0 <ThumbsUp size={size ?? 20} />
          </div>
        </div>
        {children}
      </div>
    </>
  );
}

DeleteStepOne.Divider = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn("absolute bottom-0 left-0 w-full border-t", className)}
    />
  );
};
function DeleteStepTwo() {
  return (
    <div>
      <DeleteStepOne className="text-lg" size={15}>
        <DeleteStepOne.Divider />
      </DeleteStepOne>
      <div className="space-y-3 p-4 pb-0">
        <div className="flex items-center gap-3 rounded border border-amber-400/25 bg-amber-300/10 px-3 py-4">
          <TriangleAlert size={20} className="text-amber-400" />
          <p>Unexpected bad things will happen if you don&apos;t read this!</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-muted relative w-px">
            <span className="bg-muted-foreground absolute top-2 -left-1 size-2 rounded-full" />
          </div>
          <p className="text-muted-foreground">
            This will permanently delete this post, comments, likes, shares and
            remove all data associated with this post.
          </p>
        </div>
      </div>
    </div>
  );
}
function DeleteStepThree({
  text,
  handleTextChange,
}: {
  text: string;
  handleTextChange: (value: string) => void;
}) {
  return (
    <div>
      <DeleteStepOne className="text-lg" size={15}>
        <DeleteStepOne.Divider className="-left-4 w-[calc(100%+32px)]" />
      </DeleteStepOne>
      <FieldGroup className="p-4 pb-0">
        <Field>
          <Label htmlFor="confirm">
            To confirm, type "delete" in the box below
          </Label>
          <Input
            id="confirm"
            name="confirm"
            className="border-destructive"
            value={text}
            onChange={(e) => handleTextChange?.(e.target.value)}
          />
        </Field>
      </FieldGroup>
    </div>
  );
}
