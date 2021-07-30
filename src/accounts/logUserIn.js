import { createSession } from "./session.js"

export async function logUserIn(userId, request, reply) {
  const connectionInformation = {
    ip: request.ip,
    userAgent: request.headers["user-agent"],
  }
  // create session
  const sessionToken = await createSession(userId, connectionInformation)
  // create JWT
  // set cookie
}
