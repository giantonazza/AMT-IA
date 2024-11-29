import prisma from '../lib/prisma'

async function main() {
  try {
    // Intenta obtener todos los usuarios
    const users = await prisma.user.findMany()
    console.log('Conexión exitosa. Usuarios en la base de datos:', users.length)

    // Intenta crear un nuevo usuario de prueba
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        externalId: 'test-external-id',
        isSubscribed: false,
        points: 0
      }
    })
    console.log('Usuario de prueba creado:', testUser)

    // Elimina el usuario de prueba
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('Usuario de prueba eliminado')

  } catch (error) {
    console.error('Error al conectar con la base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

