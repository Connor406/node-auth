import jwt from "jsonwebtoken"

const JWTSecret = process.env.JWT_SECRET

export async function logUserOut(request, reply) {
  try {
    const { session } = await import("../session/session.js")
    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies
      // decode refresh token
      const { sessionToken } = jwt.verify(refreshToken, JWTSecret)
      // Delete database record for session
      await session.deleteOne({ sessionToken })
    }
    // Remove cookies
    reply.clearCookie("refreshToken").clearCookie("accessToken")
  } catch (e) {
    console.error(e)
  }
}
