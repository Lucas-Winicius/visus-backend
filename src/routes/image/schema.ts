import { z } from 'zod/v4'
import { normalize } from '../../utilities/generic'

export const createImage = z.object({
  token: z.string(),
  url: z.url(),
  title: z.string(),
  description: z.string(),
  slug: z.string().transform(normalize),
  location: z.string(),
  tags: z.string().array(),
  views: z.int().default(0),
})

export const getImagesSchema = z.object({
  token: z.string().optional().default(''),
})
