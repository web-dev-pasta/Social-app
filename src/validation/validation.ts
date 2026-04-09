import z from "zod";

const requiredField = (message?: string) => {
  return z
    .string()
    .trim()
    .min(1, message ?? "Required");
};

const baseLoginSchema = {
  password: requiredField("Please enter password"),
};

export const SignupSchema = z
  .object({
    name: requiredField("Please enter name")
      .min(3, "Name cannot be less than 3 chars")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Only letters, numbers, -, _ are allowed with no spaces",
      )
      .max(7, "Name can't exceed 7 characters"),
    email: z.email("Invalid email address"),
    password: requiredField("Please enter password").min(
      8,
      "Password must be at least 8 characters",
    ),
  })
  .refine((data) => !data.password.includes(" "), {
    error: "No spaces allowed",
    path: ["password"],
  });
export type SignupValues = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  ...baseLoginSchema,
  usernameOrEmail: requiredField("Please enter email or username"),
});

export type LoginValues = z.infer<typeof LoginSchema>;

export const createPostSchema = z.object({
  content: requiredField(),
});

export const UpdateUserProfileSchema = z.object({
  displayUsername: requiredField("Please enter name")
    .min(3, "Name cannot be less than 3 chars")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, -, _ are allowed with no spaces",
    )
    .max(7, "Name can't exceed 7 characters"),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters"),
});

export type UpdateUserProfileValues = z.infer<typeof UpdateUserProfileSchema>;
