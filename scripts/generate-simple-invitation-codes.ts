import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function generateInvitationCodes(count: number, createdBy: string) {
  const codes = Array.from({ length: count }, () => uuidv4().slice(0, 8))

  await prisma.invitationCode.createMany({
    data: codes.map(code => ({ code, createdBy })),
    skipDuplicates: true,
  })

  const filePath = path.join(__dirname, '..', 'invitation-codes.txt')
  fs.writeFileSync(filePath, codes.join('\n'), 'utf-8')

  console.log(`${count} códigos de invitación generados y guardados en ${filePath}`)
  console.log('Los códigos también se han guardado en la base de datos.')
}

// Genera 30 códigos de invitación
// Note: You need to provide a valid user ID for the createdBy parameter
const ADMIN_USER_ID = 'your-admin-user-id-here' // Replace this with an actual user ID
generateInvitationCodes(30, ADMIN_USER_ID)
  .catch(e => {
    console.error('Error al generar códigos de invitación:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

