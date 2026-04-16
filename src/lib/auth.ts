import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
      username: {
        type: "string",
        unique: true,
        required: false,
      },
    },
  },
  plugins: [
    username({
      maxUsernameLength: 7,
      usernameValidator(username) {
        return /^[a-zA-Z0-9_-]+$/.test(username);
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
