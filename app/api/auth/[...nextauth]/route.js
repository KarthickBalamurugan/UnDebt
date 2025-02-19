import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt", // Uses JWT for session persistence
    maxAge: 30 * 24 * 60 * 60, // Session lasts 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub; // Ensure user ID is stored
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl; // Redirect to base URL
    },
  },
});

export { handler as GET, handler as POST };
