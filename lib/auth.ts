import { NextAuthOptions } from "next-auth"

// Use a default secret for development
const secret = process.env.NEXTAUTH_SECRET || "development-secret-key-123"

export const authOptions: NextAuthOptions = {
  providers: [],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
      }
      return session
    },
  },
  secret,
} 