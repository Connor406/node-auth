import { randomBytes } from "crypto"

export async function createSession(userId, connection) {
  try {
    // generate session token
    const sessionToken = randomBytes(48).toString("hex")
    // get connection information
    const { ip, userAgent } = connection
    // database insert for session
    const { session } = await import("../session/session.js")
    await session.insertOne({
      sessionToken,
      userId,
      valid: true,
      userAgent,
      ip,
      updatedAt: new Date(),
      createdAt: new Date(),
    })
    // return session token
    return sessionToken
  } catch (e) {
    throw new Error("Session creation failed")
  }
}
