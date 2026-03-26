import z from "zod";

const requiredField = (message?: string) => {
  return z
    .string()
    .trim()
    .min(1, message ?? "Required");
};

export const SignupSchema = z
  .object({
    name: requiredField("Please enter name").regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, -, _ are allowed with no spaces",
    ),
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
  email: z.email(),
  password: requiredField("Please enter password"),
});

export type LoginValues = z.infer<typeof LoginSchema>;
