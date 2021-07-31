import jwt from "jsonwebtoken"

const JWTSecret = process.env.JWT_SECRET

export async function getUserFromCookie(request) {
  try {
    // check if access tokens exists
    if (request?.cookies?.accessToken) {
      const { accessToken } = request.cookies
      // decode JWT
      const decodedAccessToken = jwt.verify(accessToken, JWTSecret)
      console.log("decoded Token: ", decodedAccessToken)
      // return user from record
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
