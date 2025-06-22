import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import prisma from '../../database/database'

interface GetImageParams {
  slug: string
}

export default async function getImage(app: FastifyInstance) {
  app.get(
    '/images/:slug',
    async (
      request: FastifyRequest<{ Params: GetImageParams }>,
      reply: FastifyReply
    ) => {
      const slug = request.params.slug
      const image = await prisma.image.findFirst({
        where: {
          slug: slug,
        },
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
      })

      if (!image)
        return reply.status(404).send({
          status: 404,
          message: 'image not found',
        })

      await prisma.image.update({
        where: {
          id: image.id,
        },
        data: {
          views: image.views + 1,
        },
      })

      return reply.send(image)
    }
  )
}
