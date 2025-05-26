import jwt from 'jsonwebtoken'

export const generate = (data: string | object) => {
  return jwt.sign(
    {
      data: data,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
}
