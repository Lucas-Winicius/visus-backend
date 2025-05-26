import { z } from 'zod/v4'
import { capitalize, normalize } from '../../utilities/generic'
import { hash } from '../../utilities/hash'

export const createUser = z.object({
  name: z.string().transform(capitalize),
  username: z.string().transform(normalize),
  email: z.email().optional(),
  password: z.string().transform(async (pass) => (await hash(pass)).hash),
})
