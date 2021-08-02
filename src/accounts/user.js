import jwt from "jsonwebtoken"
import mongo from "mongodb"

const { ObjectId } = mongo

const JWTSecret = process.env.JWT_SECRET

export async function getUserFromCookie(request) {
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
    // decode refresh token
    // look up session
    // if session is valid
    // refresh tokens => return current user
  } catch (e) {
    console.error(e)
  }
}

// export async function refreshToken() {
//   try {
//   } catch (e) {
//     console.error(e)
//   }
// }
