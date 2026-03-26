"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SignupSchema, SignupValues } from "@/validation/validation";
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

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return {
        message: "User already exist",
        error: true,
        errorType: "email" as "email",
      };
    }
    const user = await auth.api.signUpEmail({
      body: { name, email, password, displayName: name },
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
