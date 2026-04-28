import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextAuthConfig, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ?? [];

interface ExtendedJWT extends JWT {
  isAdmin?: boolean;
}

interface ExtendedSession extends Session {
  user: Session["user"] & {
    isAdmin?: boolean;
  };
}

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user?.email) {
        (token as ExtendedJWT).isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session as ExtendedSession).user.isAdmin = (token as ExtendedJWT).isAdmin;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
    };
  }
}
