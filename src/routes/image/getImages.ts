import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import prisma from '../../database/database'

export default async function getImages(app: FastifyInstance) {
  app.get('/images', async (request: FastifyRequest, reply: FastifyReply) => {
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
          }
        }
      },
    })

    return reply.send(images)
  })
}
