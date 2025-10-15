import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { schema } from "./db/schema";

export const auth = betterAuth({
  appName: "Blog App",
  secret: process.env.AUTH_SECRET as string,
  baseURL: process.env.NEXTAUTH_URL as string,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users, // users table
      account: schema.accounts, // accounts table
      session: schema.sessions, // sessions table
      // optional: map fields
      fields: {
        accountId: "accountId",
        providerId: "providerId",
        password: "password",
        userId: "userId",
      },
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
    maxPasswordLength: 100,
    autoSignIn: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
    disableSessionRefresh: true,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  },
});
