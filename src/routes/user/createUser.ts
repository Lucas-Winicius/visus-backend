// CREATE USER
import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { createUser } from './schema'
import prisma from '../../database/database'
import { generate } from '../../utilities/tokens'
import { hash } from '../../utilities/hash'

export default async function post(app: FastifyInstance) {
  app.post('/user', async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await createUser.safeParseAsync(request.body)

    if (!data.data) {
      return reply.status(400).send({
        status: 400,
        message: data.error.message!,
      })
    }

    const query = await prisma.user.create({
      data: {
        ...data.data,
        password: (await hash(data.data.password)).hash!,
      },
    })

    const token = generate(query.id)
    
    return reply
      .status(201)
      .headers({
        cookie: token,
        'set-cookie': token,
      })
      .send({
        status: 201,
        message: 'User created',
        token,
        data: {
          name: query.name,
          username: query.username,
          email: query.email,
        },
      })
  })
}
