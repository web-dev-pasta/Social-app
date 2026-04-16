import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from "@/lib/types";
import {
  UpdateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUpdateProfileMutations } from "./mutations";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import LoadingButton from "@/components/loading-button";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import Image, { StaticImageData } from "next/image";
import { Camera } from "lucide-react";
import CropImageDialog from "./crop-image-dialog";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import Resizer from "react-image-file-resizer";

interface EditProfileDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const { control, handleSubmit } = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(UpdateUserProfileSchema),
    defaultValues: {
      displayUsername: user.displayUsername!,
      bio: user.bio || "",
    },
  });

  const mutation = useUpdateProfileMutations();
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  async function onSubmit(values: UpdateUserProfileValues) {
    const newImageFile = croppedImage
      ? new File([croppedImage], `avatar_${user.id}.webp`)
      : undefined;
    mutation.mutate(
      {
        values,
        image: newImageFile,
      },
      {
        onSuccess: () => {
          setCroppedImage(null);
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Avatar</Label>
          <AvatarInput
            src={
              croppedImage
                ? URL.createObjectURL(croppedImage)
                : user.image || avatarPlaceholder
            }
            onImageCropped={setCroppedImage}
          />
        </div>
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="displayUsername"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="display-username">Display Name</FieldLabel>
                <Input
                  {...field}
                  id="display-username"
                  aria-invalid={fieldState.invalid}
                  placeholder="Your display name"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="bio"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="display-bio">Bio</FieldLabel>
                <Textarea
                  id="display-bio"
                  className="resize-none"
                  aria-invalid={fieldState.invalid}
                  placeholder="Tell us a little bit about yourself"
                  autoComplete="off"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter>
            <LoadingButton
              type="submit"
              title="Save"
              isSubmitting={mutation.isPending}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only hidden"
      />
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative block"
        >
          <Image
            src={src}
            alt="Avatar preview"
            width={150}
            height={150}
            className="size-32 flex-none rounded-full object-cover"
          />
          <span className="bg-opacity-30 absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black/50 text-white transition-colors duration-200 group-hover:bg-black/60">
            <Camera size={24} />
          </span>
        </button>
      </div>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
