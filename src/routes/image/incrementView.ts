import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import prisma from '../../database/database'

interface GetImageParams {
  slug: string
}

export default async function incrementView(app: FastifyInstance) {
  app.get(
    '/images/view/:slug',
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
          views: true,
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

      return reply.send({})
    }
  )
}
