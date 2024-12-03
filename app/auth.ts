import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

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
          role: user.role === 'ADMIN' ? 'ADMIN' : 'USER', // Ensure role is either 'ADMIN' or 'USER'
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
        session.user.role = token.role as 'ADMIN' | 'USER'
        session.user.subscriptionTier = token.subscriptionTier as 'FREE' | 'PREMIUM'
        session.user.points = token.points as number
        session.user.externalId = token.externalId as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

