import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function main() {
  // Create an admin user
  const adminPassword = await bcrypt.hash('adminPassword123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@amtia.com' },
    update: {},
    create: {
      email: 'admin@amtia.com',
      name: 'Administrador AMT IA',
      password: adminPassword,
      points: 1000,
      externalId: uuidv4(), // Add this line
    },
  })

  // Create a regular user
  const userPassword = await bcrypt.hash('userPassword123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'usuario@amtia.com' },
    update: {},
    create: {
      email: 'usuario@amtia.com',
      name: 'Usuario AMT IA',
      password: userPassword,
      points: 100,
      externalId: uuidv4(), // Add this line
    },
  })

  // Create a sample conversation
  await prisma.conversation.create({
    data: {
      userId: user.id,
      messages: {
        create: [
          {
            role: 'user',
            content: '¿Cómo puedo mejorar mi productividad?',
          },
          {
            role: 'assistant',
            content: 'Para mejorar tu productividad, puedes seguir estos pasos: 1. Establece metas claras, 2. Prioriza tus tareas, 3. Utiliza la técnica Pomodoro, 4. Elimina distracciones, 5. Toma descansos regulares.',
          },
        ],
      },
    },
  })

  // Create a sample transaction
  await prisma.transaction.create({
    data: {
      userId: user.id,
      amount: 9.99,
      type: 'SUBSCRIPTION',
      status: 'COMPLETED',
      paymentId: uuidv4(),
      externalReference: `AMT-IA-${Date.now()}`,
    },
  })

  console.log('Datos de prueba insertados exitosamente:')
  console.log(`Admin creado: ${admin.email}`)
  console.log(`Usuario creado: ${user.email}`)
  console.log(`Conversación creada para: ${user.email}`)
  console.log(`Transacción creada para: ${user.email}`)
}

main()
  .catch((e) => {
    console.error('Error durante el seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

