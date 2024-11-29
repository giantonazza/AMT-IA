import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function generateInvitationCodes(count: number) {
  const codes = Array.from({ length: count }, () => uuidv4().slice(0, 8))
  
  await prisma.invitationCode.createMany({
    data: codes.map(code => ({ code })),
    skipDuplicates: true,
  })

  console.log(`${count} códigos de invitación generados.`)
}

// Genera 100 códigos de invitación
generateInvitationCodes(100)
  .catch(e => {
    console.error('Error al generar códigos de invitación:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

