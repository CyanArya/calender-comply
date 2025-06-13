import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // For demonstration purposes, we'll accept any username and password
        // In a real application, you would validate these against a database
        if (credentials?.username && credentials?.password) {
          // You can add your actual authentication logic here
          // For now, let's just assume a successful login
          return { id: credentials.username, name: credentials.username, email: credentials.username + "@example.com" };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin", // Custom sign-in page (we'll handle this in app/page.tsx)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 