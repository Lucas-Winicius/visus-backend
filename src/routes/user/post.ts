import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { createUser } from './schema'
import prisma from '../../database/database'
import { email } from 'zod/v4'

export default async function post(app: FastifyInstance) {
  app.post('/user', async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await createUser.safeParseAsync(request.body)

    if (data.success) {
      const query = await prisma.user.create({ data: data.data })

      return reply.status(201).send({
        status: 201,
        message: 'User created',
        data: {
          name: query.name,
          username: query.username,
          email: query.email,
        },
      })
    }

    return reply.status(200).send(data)
  })
}
