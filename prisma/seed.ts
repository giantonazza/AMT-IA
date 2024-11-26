import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Aquí puedes agregar datos iniciales
  // Por ejemplo:
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'hashedpassword', // Asegúrate de hashear las contraseñas en producción
      role: 'ADMIN'
    },
  })

  console.log('Seed data inserted successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



