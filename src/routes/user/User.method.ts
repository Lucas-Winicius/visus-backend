import prisma from '../../database/database'
import { verify } from '../../utilities/tokens'

export async function verifyUserRole(role: string, token: string) {
  const auth = verify(token)

  if (!auth.success) return null

  const payload = auth.data

  if (
    typeof payload !== 'object' ||
    !('data' in payload) ||
    typeof payload.data !== 'object' ||
    !('id' in payload.data)
  ) {
    return false
  }

  return payload.data
}
