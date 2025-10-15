import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXTAUTH_URL as string,
});

export const { signUp, signIn, signOut, useSession } = authClient;
