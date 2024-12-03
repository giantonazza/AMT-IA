import prisma from '../lib/prisma'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

async function main() {
  try {
    // Attempt to get all users
    const users = await prisma.user.findMany()
    console.log('Successful connection. Users in the database:', users.length)

    // Hash the password before creating the user
    const hashedPassword = await bcrypt.hash('testpassword', 10)
    
    // Attempt to create a new test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        externalId: uuidv4(),
        subscriptionTier: 'FREE',
        role: 'USER',
        points: 0
      }
    })
    console.log('Test user created:', testUser)

    // Delete the test user
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('Test user deleted')

  } catch (error) {
    console.error('Error connecting to the database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

