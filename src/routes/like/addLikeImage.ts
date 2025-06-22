import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { addLikeImageSchema } from './schema'
import prisma from '../../database/database'
import { verifyUserRole } from '../user/User.method'

export default async function addLikeImage(app: FastifyInstance) {
  app.post('/likes', async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await addLikeImageSchema.safeParseAsync(request.body)

    if (!data.data) {
      return reply.status(400).send({
        status: 400,
        message: data.error.message!,
      })
    }

    const userRole = await verifyUserRole(['USER', 'ADMIN'], data.data.token)

    if (!userRole.match)
      return reply.status(401).send({
        status: 401,
        message: "You role don't match",
      })

    const like = await prisma.like.create({
      data: {
        userId: userRole.id!,
        imageId: data.data.imageId,
      },
    })

    return reply.send(like)
  })
}
