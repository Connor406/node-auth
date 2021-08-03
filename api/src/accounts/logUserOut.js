import jwt from "jsonwebtoken"
const { ROOT_DOMAIN, JWT_SECRET } = process.env

export async function logUserOut(request, reply) {
  try {
    const { session } = await import("../session/session.js")
    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies
      // decode refresh token
      const { sessionToken } = jwt.verify(refreshToken, JWT_SECRET)
      // Delete database record for session
      await session.deleteOne({ sessionToken })
    }
    // Remove cookies
    reply
      .clearCookie("refreshToken", {
        path: "/",
        domain: ROOT_DOMAIN,
        httpOnly: true,
        secure: true,
      })
      .clearCookie("accessToken", {
        path: "/",
        domain: ROOT_DOMAIN,
        httpOnly: true,
        secure: true,
      })
  } catch (e) {
    console.error(e)
  }
}
