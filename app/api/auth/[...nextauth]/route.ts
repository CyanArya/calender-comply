import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      // Set default user info
      token.id = "default-user";
      token.name = "Default User";
      token.email = "user@example.com";
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 