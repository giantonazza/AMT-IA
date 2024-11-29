import { PrismaClient } from '@prisma/client'
import cron from 'node-cron'

const prisma = new PrismaClient()

export function startCleanupJob() {
  // Ejecutar el trabajo cada día a la medianoche
  cron.schedule('0 0 * * *', async () => {
    console.log('Ejecutando trabajo de limpieza...')

    const now = new Date()

    try {
      // Eliminar usuarios no suscritos que han expirado
      await prisma.user.deleteMany({
        where: {
          isSubscribed: false,
          expiresAt: {
            lt: now
          }
        }
      })

      // Eliminar usuarios no suscritos que no han accedido en los últimos 30 días
      await prisma.user.deleteMany({
        where: {
          isSubscribed: false,
          lastAccessAt: {
            lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })

      console.log('Limpieza completada')
    } catch (error) {
      console.error('Error durante la limpieza:', error)
    }
  })
}

