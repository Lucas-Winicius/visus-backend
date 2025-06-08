import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { createImage } from './schema'
import { verifyUserRole } from '../user/User.method'

export default async function postImage(app: FastifyInstance) {
  app.post('/images', async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await createImage.safeParseAsync(request.body)

    if (!data.data) {
      return reply.status(400).send({
        status: 400,
        message: data.error.message!,
      })
    }

    const userRole = await verifyUserRole('ADMIN', data.data.token)

    return reply.send(userRole)

    return reply.send(data)
  })
}
