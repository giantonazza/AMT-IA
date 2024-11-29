import NextAuth, { DefaultSession, User, Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { startCleanupJob } from '@/lib/cleanupJob'

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      isVIP: boolean
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isVIP: boolean
  }
}

startCleanupJob()

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        invitationCode: { label: "Invitation Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, email: true, name: true, password: true, isVIP: true }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) {
          return null
        }

        if (credentials.invitationCode) {
          const invitationCode = await prisma.invitationCode.findUnique({
            where: { code: credentials.invitationCode },
          })

          if (invitationCode && !invitationCode.usedBy) {
            await prisma.invitationCode.update({
              where: { id: invitationCode.id },
              data: { usedBy: user.id, usedAt: new Date() },
            })
            await prisma.user.update({
              where: { id: user.id },
              data: { isSubscribed: true },
            })
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isVIP: user.isVIP,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user?: User & { isVIP?: boolean } }) {
      if (user) {
        token.id = user.id
        token.isVIP = user.isVIP || false
      }
      return token
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          isVIP: token.isVIP
        }
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

