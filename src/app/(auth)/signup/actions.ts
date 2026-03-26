"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SignupSchema, SignupValues } from "@/validation/validation";

type ErrorType = "email" | "username";
export const signupAction = async (credentials: SignupValues) => {
  try {
    const result = SignupSchema.safeParse(credentials);
    if (!result.success) {
      return {
        message: result.error.issues[0].message,
        error: true,
      };
    }
    const data = {
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
    };
    const { name, email, password } = data;

    const existingName = await prisma.user.findFirst({
      where: {
        name,
      },
    });
    if (existingName) {
      return {
        message: "This username is currently used",
        error: true,
        errorType: "username" as ErrorType,
      };
    }
    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingEmail) {
      return {
        message: "This email is currently used",
        error: true,
        errorType: "email" as ErrorType,
      };
    }
    const user = await auth.api.signUpEmail({
      body: { name, email, password, displayUsername: name },
    });
    return {
      message: "User created successfully",
      user,
    };
  } catch (error) {
    return {
      message: "Something went wrong",
      error: true,
    };
  }
};
