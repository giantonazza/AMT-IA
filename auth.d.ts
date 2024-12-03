import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'ADMIN' | 'USER'
      subscriptionTier: 'FREE' | 'PREMIUM'
      points: number
      externalId: string
    } & DefaultSession['user']
  }

  interface User {
    role: 'ADMIN' | 'USER'
    subscriptionTier: 'FREE' | 'PREMIUM'
    points: number
    externalId: string
  }
}

