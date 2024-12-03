import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getVendorCredentials(vendorId: string) {
  const credentials = await prisma.vendorCredentials.findUnique({
    where: { vendorId },
  })
  return credentials
}

export async function saveVendorCredentials(vendorId: string, apiKey: string, secret?: string) {
  const credentials = await prisma.vendorCredentials.upsert({
    where: { vendorId },
    update: { apiKey, secret },
    create: { vendorId, apiKey, secret },
  })
  return credentials
}

export async function deleteVendorCredentials(vendorId: string) {
  await prisma.vendorCredentials.delete({
    where: { vendorId },
  })
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  return user
}

export async function createUser(userData: {
  email: string
  name?: string
  password?: string
  externalId: string
}) {
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name || '',
      password: userData.password || '',
      externalId: userData.externalId,
      role: 'USER',
      subscriptionTier: 'FREE',
      points: 0,
    },
  })
  return user
}

export async function updateUser(userId: string, userData: {
  email?: string
  name?: string
  password?: string
  isSubscribed?: boolean
  subscriptionExpiresAt?: Date
  points?: number
}) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: userData,
  })
  return user
}

export async function createConversation(userId: string) {
  const conversation = await prisma.conversation.create({
    data: {
      userId,
    },
  })
  return conversation
}

export async function addMessageToConversation(conversationId: string, message: {
  role: string
  content: string
}) {
  const updatedConversation = await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      messages: {
        create: message,
      },
    },
    include: {
      messages: true,
    },
  })
  return updatedConversation
}

export async function createTransaction(transactionData: {
  userId: string
  paymentId: string
  amount: number
  type: string
  status: string
  externalReference: string
}) {
  const transaction = await prisma.transaction.create({
    data: transactionData,
  })
  return transaction
}

export async function getTransactionsByUserId(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return transactions
}

export default prisma

