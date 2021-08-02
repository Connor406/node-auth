import jwt from "jsonwebtoken"
import mongo from "mongodb"
import { session } from "../session/session.js"
import { createTokens } from "./tokens.js"

const { ObjectId } = mongo

const JWTSecret = process.env.JWT_SECRET

export async function getUserFromCookie(request, reply) {
  try {
    const { user } = await import("../user/user.js")
    // check if access tokens exists
    if (request?.cookies?.accessToken) {
      const { accessToken } = request.cookies
      // decode JWT
      const decodedAccessToken = jwt.verify(accessToken, JWTSecret)
      // return user from record
      return user.findOne({
        _id: ObjectId(decodedAccessToken?.userId),
      })
    }
    //! if there is no access token, but there is a refresh token!!
    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies
      // decode refresh token
      const { sessionToken } = jwt.verify(refreshToken, JWTSecret)
      // look up session
      const currentSession = await session.findOne({ sessionToken })
      // if session is valid
      if (currentSession.valid) {
        // refresh tokens => return current user
        const currentUser = await user.findOne({
          _id: ObjectId(currentSession.userId),
        })
        console.log("current user: ", currentUser)
        // refresh the tokens
        await refreshTokens(sessionToken, currentUser._id, reply)
        // return current user
        return currentUser
      }
    }
  } catch (e) {
    console.error(e)
  }
}

export async function refreshTokens(sessionToken, userId, reply) {
  try {
    // create jwt
    const { accessToken, refreshToken } = await createTokens(sessionToken, userId)
    // Set cookie
    const now = new Date()
    const refreshExpires = now.setDate(now.getDate() + 30)
    reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
        expires: refreshExpires,
      })
      .setCookie("accessToken", accessToken, { path: "/", domain: "localhost", httpOnly: true })
  } catch (e) {
    console.error(e)
  }
}
