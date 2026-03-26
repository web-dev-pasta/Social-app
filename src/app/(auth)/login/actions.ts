"use server";

import { auth } from "@/lib/auth";
import { LoginSchema, LoginValues } from "@/validation/validation";

export const loginAction = async (credentials: LoginValues) => {
  try {
    const result = LoginSchema.safeParse(credentials);
    if (!result.success) {
      return {
        message: result.error.issues[0].message,
        error: true,
      };
    }
    const data = {
      email: result.data.email,
      password: result.data.password,
    };
    const { email, password } = data;
    const user = await auth.api.signInEmail({
      body: { email, password, rememberMe: true },
    });
    return {
      message: "Logged in successfully",
      user,
      error: false,
    };
  } catch (err) {
    const error = err as Error;
    return {
      message: error.message,
      error: true,
    };
  }
};
