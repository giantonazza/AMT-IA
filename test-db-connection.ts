import prisma from './lib/prisma'

async function main() {
  try {
    // Intenta obtener todos los usuarios
    const users = await prisma.user.findMany()
    console.log('Usuarios en la base de datos:', users)

    // Intenta crear un nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'testpassword', // Recuerda hashear las contraseñas en producción
        role: 'USER'
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

