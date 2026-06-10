import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import httpClient from "./lib/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        taxcode: {},
      },
      authorize: async (credentials) => {
        const rs: any = await httpClient.post(
          `${process.env.API_URL_DEV_SYSTEM}/api/v0/user/login-desktop`,
          {
            gmail: credentials?.email,
            password: credentials?.password,
            taxcode: credentials?.taxcode,
            uuid: credentials?.email,
          },
        );

        console.log("0a0aa0aaaaa", rs);
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
      if (pathname === "/" || pathname.startsWith("/assets/")) {
        return true;
      }
      return !!auth?.user?.id;
    },
  },
});
