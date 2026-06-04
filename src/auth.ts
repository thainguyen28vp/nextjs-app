import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sendRequest } from "./utils/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        taxcode: {},
      },
      authorize: async (credentials) => {
        const rs: any = await sendRequest({
          url: "https://api-system-k8s.1business.vn/api/v0/user/login-desktop",
          method: "POST",
          headers: {
            platform: "client-desktop",
          },
          body: {
            gmail: credentials?.email,
            password: credentials?.password,
            taxcode: credentials?.taxcode,
            uuid: credentials?.email,
          },
        });
        if (rs?.code) {
          throw rs;
        }
        return {
          id: rs?.user?.id,
          name: rs?.user?.name,
          email: rs?.user?.gmail,
          image: rs?.user?.avatar,
          accessToken: rs?.accessToken,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },

    authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname;
      if (pathname === "/") {
        return true;
      }
      return !!auth?.user?.id;
    },
  },
});
