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

export async function verify(hash: string, plainText: string) {
  try {
    if (await argon2.verify(hash, plainText)) {
      return {
        success: true,
        match: true,
      }
    } else {
      return {
        success: true,
        match: false,
      }
    }
  } catch (err) {
    return {
      success: false,
      err,
    }
  }
}
