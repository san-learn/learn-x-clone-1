import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.username = session.user.name
          ?.split(" ")
          .join("")
          .toLowerCase();
        session.user.uid = token.sub;
      }

      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      username?: string | null | undefined;
      uid?: string | null | undefined;
    } & DefaultSession["user"];
  }
}

export { handler as GET, handler as POST };
