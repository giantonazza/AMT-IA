import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        externalId: uuidv4(),
        role: 'USER',
        subscriptionTier: 'FREE',
        points: 0,
      },
    })

    return NextResponse.json({ 
      message: 'Usuario registrado exitosamente',
      user: { id: user.id, email: user.email, name: user.name }
    })
  } catch (error) {
    console.error('Error en el registro:', error)
    return NextResponse.json({ error: 'Error en el registro' }, { status: 500 })
  }
}

