import bcrypt from "bcryptjs"
const { compare } = bcrypt

export async function authorizeUser(email, password) {
  // import user collection from mongo
  const { user } = await import("../user/user.js")
  // Look up user
  const userData = await user.findOne({
    "email.address": email,
  })
  if (userData) {
    // get user password
    const savedPw = userData.password
    // compare password with one in DB
    const isAuthorized = await compare(password, savedPw)
    // return boolean if pw is correct
    return { isAuthorized, userId: userData._id, authenticatorSecret: userData.authenticator }
  }
  return {
    isAuthorized: false,
    userId: null,
    authenticatorSecret: null,
  }
}
