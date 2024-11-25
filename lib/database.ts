import prisma from './prisma'

export async function getVendorCredentials(vendorId: string) {
  const credentials = await prisma.vendorCredentials.findUnique({
    where: { vendorId },
  })
  return credentials
}

export async function saveVendorCredentials(vendorId: string, accessToken: string, publicKey: string) {
  await prisma.vendorCredentials.upsert({
    where: { vendorId },
    update: { accessToken, publicKey },
    create: { vendorId, accessToken, publicKey },
  })
}

export async function createUser(email: string, name: string, password: string) {
  return await prisma.user.create({
    data: { email, name, password },
  })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

export async function createTransaction(userId: string, amount: number, status: 'PENDING' | 'COMPLETED' | 'FAILED', paymentMethod: string, mercadoPagoId?: string) {
  return await prisma.transaction.create({
    data: { userId, amount, status, paymentMethod, mercadoPagoId },
  })
}

export async function createChatSession(userId: string) {
  return await prisma.chatSession.create({
    data: { userId },
  })
}

export async function addMessageToChatSession(chatSessionId: string, content: string, role: 'USER' | 'AI') {
  return await prisma.message.create({
    data: { chatSessionId, content, role },
  })
}


