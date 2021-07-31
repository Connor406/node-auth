import jwt from "jsonwebtoken"

const JWTSecret = process.env.JWT_SECRET

export async function createTokens(sessionToken, userId) {
  try {
    // create refresh token
    const refreshToken = jwt.sign(
      {
        sessionToken,
      },
      JWTSecret
    )
    // create access token
    // session id, user id
    const accessToken = jwt.sign(
      {
        sessionToken,
        userId,
      },
      JWTSecret
    )
    // return refresh token & access token
    return { refreshToken, accessToken }
  } catch (e) {
    console.error(e)
  }
}
