import bcrypt from "bcryptjs"
const { genSalt, hash } = bcrypt

export async function registerUser(email, password) {
  const { user } = await import("../user/user.js")
  // generate salt
  const salt = await genSalt(10)
  // hash w/ salt
  const hashedPw = await hash(password, salt)
  // send to DB
  const result = await user.insertOne({
    email: {
      address: email,
      verified: false,
    },
    password: hashedPw,
  })

  // return user from DB
  return result.insertedId
}
