import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import prisma from '../../database/database'
import { getImagesSchema } from './schema'
import { verifyUserRole } from '../user/User.method'

export default async function getImagesByTime(app: FastifyInstance) {
  app.get('/imagesByTime', async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await getImagesSchema.safeParseAsync(request.query)
    const token = data.data?.token || ''
    const userRole = await verifyUserRole(['ADMIN', 'USER'], token)

    // Busca todas as imagens
    const images = await prisma.image.findMany({
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        slug: true,
        location: true,
        tags: true,
        views: true,
        createdAt: true,
        uploadedBy: {
          select: {
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Busca likes do usuário (caso autenticado)
    const userLikes = await prisma.like.findMany({
      where: { userId: userRole.id || 0 },
      select: { imageId: true },
    })

    const likedImageIds = new Set(userLikes.map(like => like.imageId))

    // Adiciona campo "liked" e agrupa por ano/mês
    const grouped: Record<string, {
      year: number
      month: number
      images: any[]
    }> = {}

    for (const image of images) {
      const createdAt = new Date(image.createdAt)
      const year = createdAt.getFullYear()
      const month = createdAt.getMonth() + 1 // 0-indexed

      const key = `${year}-${month}`

      if (!grouped[key]) {
        grouped[key] = {
          year,
          month,
          images: [],
        }
      }

      grouped[key].images.push({
        ...image,
        liked: likedImageIds.has(image.id),
      })
    }

    // Converte o objeto em array e ordena por ano/mês decrescente
    const result = Object.values(grouped).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return b.month - a.month
    })

    return reply.send(result)
  })
}
