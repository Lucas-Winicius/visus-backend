import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'

export default async function get(app: FastifyInstance) {
  app.get('/user', (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send('Hello World!')
  })
}
