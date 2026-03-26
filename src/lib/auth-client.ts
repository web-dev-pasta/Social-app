import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import {
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    usernameClient(),
    nextCookies(),
  ],
});
