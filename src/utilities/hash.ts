import * as argon2 from 'argon2'

export async function hash(text: string) {
  try {
    const hash = await argon2.hash(text)
    return {
      success: true,
      hash,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}
