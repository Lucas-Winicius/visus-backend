// USER LOGIN
import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { loginSchema } from './schema'
import prisma from '../../database/database'
import { generate } from '../../utilities/tokens'
import { verify } from '../../utilities/hash'

export default async function login(app: FastifyInstance) {
  app.post(
    '/user/login',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = await loginSchema.safeParseAsync(request.body)

      if (!data.data) {
        return reply.status(400).send({
          status: 400,
          message: data.error.message!,
        })
      }

      const query = await prisma.user.findFirst({
        where: {
          OR: [{ email: data.data.email }, { username: data.data.username }],
        },
      })

      if (!query) {
        return reply.status(401).send({
          status: 401,
          message: 'Invalid credentials',
        })
      }

      const passMatch = await verify(query?.password, data.data.password)

      if (!passMatch.match)
        return reply.status(401).send({
          status: 401,
          message: 'Invalid credentials',
        })

      const token = generate(query.id)

      return reply
        .status(200)
        .headers({
          cookie: token,
          'set-cookie': token,
        })
        .send({
          status: 200,
          message: 'User login',
          token,
          data: {
            name: query.name,
            username: query.username,
            email: query.email,
          },
        })
    }
  )
}
