import prisma from './lib/prisma'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

async function main() {
  try {
    // Intenta obtener todos los usuarios
    const users = await prisma.user.findMany()
    console.log('Usuarios en la base de datos:', users)

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash('testpassword', 10)

    // Intenta crear un nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        externalId: uuidv4(),
        isSubscribed: false,
        points: 0
      }
    })
    console.log('Nuevo usuario creado:', newUser)

  } catch (error) {
    console.error('Error al conectar con la base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

