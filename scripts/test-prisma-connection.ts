import prisma from '../lib/prisma'

async function main() {
  try {
    // Probar la conexión
    await prisma.$connect()
    console.log('Conexión a la base de datos exitosa')

    // Realizar una operación de prueba
    const userCount = await prisma.user.count()
    console.log(`Número de usuarios en la base de datos: ${userCount}`)

    // Crear un usuario de prueba
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

    // Eliminar el usuario de prueba
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('Usuario de prueba eliminado')

  } catch (error) {
    console.error('Error al probar la conexión de Prisma:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

