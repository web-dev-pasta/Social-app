"use server";

import { auth } from "@/lib/auth";
import { LoginSchema, LoginValues } from "@/validation/validation";
import z from "zod";

export const loginAction = async (credentials: LoginValues) => {
  try {
    const result = LoginSchema.safeParse(credentials);
    if (!result.success) {
      return {
        message: result.error.issues[0].message,
        error: true,
      };
    }
    const username = z
      .string()
      .regex(/^[a-zA-Z0-9_-]+$/)
      .safeParse(result.data.usernameOrEmail);
    const email = z.email().safeParse(result.data.usernameOrEmail);
    const password = result.data.password;

    if (username.success && !email.success) {
      await auth.api.signInUsername({
        body: {
          username: username.data,
          password,
        },
      });
    }
    if (email.success && !username.success) {
      await auth.api.signInEmail({
        body: {
          email: email.data,
          password,
        },
      });
    }
    console.log({ email: email.success, username: username.success });

    if (
      (!email.success && !username.success) ||
      (email.success && username.success)
    ) {
      return {
        message: "Something went wrong",
        error: true,
      };
    }

    return {
      message: "Logged in successfully",
      error: false,
    };
  } catch (err) {
    return {
      message: (err as Error).message,
      error: true,
    };
  }
};
