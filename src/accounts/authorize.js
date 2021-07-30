import bcrypt from "bcryptjs"
const { compare } = bcrypt

export async function authorizeUser(email, password) {
  // import user collection from mongo
  const { user } = await import("../user/user.js")
  // Look up user
  const userData = await user.findOne({
    "email.address": email,
  })
  // get user password
  const savedPw = userData.password
  // compare password with one in DB
  const isAuthorized = await compare(password, savedPw)
  console.log("is auth: ", isAuthorized)
  // return boolean if pw is correct
  return isAuthorized
}
