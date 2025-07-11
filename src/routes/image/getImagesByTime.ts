import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import prisma from '../../database/database'
import { getImagesSchema } from './schema'
import { verifyUserRole } from '../user/User.method'

  export default async function getImagesByTime(app: FastifyInstance) {
  app.get(
    '/imagesByTime',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = await getImagesSchema.safeParseAsync(request.query)
      const token = data.data?.token || ''
      const userRole = await verifyUserRole(['ADMIN', 'USER'], token)

      const userId = userRole.id || 0

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
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const userLikes = await prisma.like.findMany({
        where: { userId },
        select: { imageId: true },
      })

      const likedImageIds = new Set(userLikes.map((like: { imageId: unknown }) => like.imageId))

      const likeCounts = await prisma.like.groupBy({
        by: ['imageId'],
        _count: {
          imageId: true,
        },
      })

      const likeCountMap = new Map<number, number>()
      likeCounts.forEach(({ imageId, _count }: {imageId: number, _count: { imageId: number }}) => {
        likeCountMap.set(imageId, _count.imageId)
      })

      const grouped: Record<
        string,
        {
          year: number
          month: number
          images: unknown[]
        }
      > = {}

      for (const image of images) {
        const createdAt = new Date(image.createdAt)
        const year = createdAt.getFullYear()
        const month = createdAt.getMonth() + 1

        const key = `${year}-${month}`

        if (!grouped[key]) {
          grouped[key] = {
            year,
            month,
            images: [],
          }
        }

        grouped[key].images.push({
          ...image,
          liked: likedImageIds.has(image.id),
          likeCount: likeCountMap.get(image.id) || 0,
        })
      }

      const result = Object.values(grouped).sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return b.month - a.month
      })

      return reply.send(result)
    }
  )
}
