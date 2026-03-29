"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import signupImage from "@/assets/signup-image.png";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SignupSchema, SignupValues } from "@/validation/validation";
import Link from "next/link";
import { signupAction } from "@/app/(auth)/signup/actions";
import { redirect } from "next/navigation";
import LoadingButton from "./loading-button";
import SocialProviders from "./social-providers";
import { PasswordInput } from "./password-input";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    control,
    handleSubmit,
    setFocus,
    setError,
    formState: { isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  async function onSubmit(data: SignupValues) {
    const result = await signupAction(data);
    if (result.error) {
      if (result.errorType === "email") {
        setFocus("email");
        setError("email", {
          message: result.message,
        });
      }
      if (result.errorType === "username") {
        setFocus("name");
        setError("name", {
          message: result.message,
        });
      }
      return toast.error(result.message);
    }
    toast.success("User created successfully");
    redirect("/login");
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="flex h-155 items-center p-6 md:p-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email below to create your account
                </p>
              </div>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-name">Username</FieldLabel>
                    <Input
                      {...field}
                      id="form-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter username"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="form-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-password">Password</FieldLabel>
                    <PasswordInput
                      {...field}
                      id="form-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <LoadingButton
                  type="submit"
                  isSubmitting={isSubmitting}
                  title="Create Account"
                />
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <SocialProviders
                isSubmitting={isSubmitting}
                handleAppleClick={() => {}}
                handleGoogleClick={() => {}}
              />
              <FieldDescription className="text-center">
                Already have an account? <Link href="/login">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={signupImage}
              alt="signup-image"
              className="absolute inset-0 h-full w-full object-cover transition-all dark:brightness-[0.2] dark:grayscale"
              loading="eager"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="/">Terms of Service</Link> and{" "}
        <Link href="/">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
