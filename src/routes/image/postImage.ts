import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { createImage } from './schema'
import { verifyUserRole } from '../user/User.method'
import prisma from '../../database/database'

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

    if (!userRole.match)
      return reply.status(401).send({
        status: 401,
        message: 'You are not an admin',
      })

    const image = await prisma.image.create({
      data: {
        url: data.data.url,
        title: data.data.title,
        description: data.data.description,
        slug: data.data.slug,
        location: data.data.location,
        tags: data.data.tags,
        views: 0,
        uploadedById: userRole.id!
      },
    })

    return reply.send(image)

    return reply.send(data)
  })
}
