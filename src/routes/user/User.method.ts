import prisma from '../../database/database'
import { verify } from '../../utilities/tokens'

export async function verifyUserRole(role: string, token: string) {
  const auth = verify(token)

  if (!auth.success) return { match: false, id: null }

  const payload = auth.data

  if (typeof payload !== 'object' || !('data' in payload)) {
    return { match: false, id: null }
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.data,
    },
    select: {
      id: true,
      role: true,
    },
  })

  if (!user) return { match: false, id: null }
  if (user.role === role) return { match: true, id: user.id }

  return { match: false, id: null }
}
