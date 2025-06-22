import { z } from 'zod/v4'

export const addLikeImageSchema = z.object({
  token: z.string(),
  imageId: z.number()
})
