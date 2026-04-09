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

  async function onSubmit(values: UpdateUserProfileValues) {
    mutation.mutate(
      {
        values,
      },
      {
        onSuccess: () => {
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
