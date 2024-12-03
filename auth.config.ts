import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { SubscriptionTier } from "@prisma/client"
import type { DefaultSession } from "next-auth"

export const authOptions: NextAuthOptions = {
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
          return null
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
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as "ADMIN" | "USER", // Type assertion
          subscriptionTier: user.subscriptionTier,
          points: user.points,
          externalId: user.externalId
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt"
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
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "ADMIN" | "USER"
      subscriptionTier: SubscriptionTier
      points: number
      externalId: string
    } & DefaultSession["user"]
  }

  interface User {
    role: "ADMIN" | "USER"
    subscriptionTier: SubscriptionTier
    points: number
    externalId: string
  }
}


