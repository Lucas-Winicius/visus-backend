import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import prisma from '../../database/database'
import { getImagesSchema } from './schema'
import { verifyUserRole } from '../user/User.method'

export default async function getImages(app: FastifyInstance) {
  app.get('/images', async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await getImagesSchema.safeParseAsync(request.query)
    const userRole = await verifyUserRole(['ADMIN', 'USER'], data.data?.token || '')
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
        id: 'desc'
      }
    })

    const userLikes = await prisma.like.findMany({
      where: { userId: userRole.id || 0 },
      select: { imageId: true },
    })

    const likedImageIds = new Set(userLikes.map((like: { imageId: unknown }) => like.imageId))

    const imagesWithLiked = images.map((image: { id: unknown }) => ({
      ...image,
      liked: likedImageIds.has(image.id),
    }))

    return reply.send(imagesWithLiked)
  })
}
