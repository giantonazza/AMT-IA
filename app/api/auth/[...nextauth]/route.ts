import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { SubscriptionTier } from "@prisma/client"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            subscriptionTier: true,
            points: true,
            externalId: true
          }
        })

        if (!user || !user.password) {
          throw new Error('No user found')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as "ADMIN" | "USER", // Type assertion to match expected type
          subscriptionTier: user.subscriptionTier,
          points: user.points,
          externalId: user.externalId
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/register', // Changed from signUp to newUser
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.subscriptionTier = user.subscriptionTier
        token.points = user.points
        token.externalId = user.externalId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "ADMIN" | "USER"
        session.user.subscriptionTier = token.subscriptionTier as SubscriptionTier
        session.user.points = token.points as number
        session.user.externalId = token.externalId as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }

