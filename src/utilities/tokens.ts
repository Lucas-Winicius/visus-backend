import jwt from 'jsonwebtoken'

export const generate = (data: string | object | number) => {
  return jwt.sign(
    {
      data: data,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
}

export const verify = (token: string) => {
  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET!)
    return {
      success: true,
      data: tokenDecoded,
    }
  } catch (error) {
    return {
      success: false,
      error: error,
    }
  }
}
