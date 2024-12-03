import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function generateInvitationCodes(count: number, createdBy: string) {
  const codes = Array.from({ length: count }, () => uuidv4().slice(0, 8))

  await prisma.invitationCode.createMany({
    data: codes.map(code => ({ code, createdBy })),
    skipDuplicates: true,
  })

  console.log(`${count} códigos de invitación generados.`)
}

// Genera 100 códigos de invitación
// Note: You need to provide a valid user ID for the createdBy parameter
const ADMIN_USER_ID = 'your-admin-user-id-here' // Replace this with an actual user ID
generateInvitationCodes(100, ADMIN_USER_ID)
  .catch(e => {
    console.error('Error al generar códigos de invitación:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

