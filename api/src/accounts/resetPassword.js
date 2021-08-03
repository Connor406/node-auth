import crypto from "crypto"
const { ROOT_DOMAIN, JWT_SECRET } = process.env

function createResetToken(email, expTimeStamp) {
  try {
    const authString = `${JWT_SECRET}:${email}:${expTimeStamp}`
    return crypto.createHash("sha256").update(authString).digest("hex")
  } catch (err) {
    console.log(err)
  }
}

export async function createResetEmailLink(email) {
  try {
    // create link containing user email, token, expiration date
    const URIencodedEmail = encodeURIComponent(email)
    const expTimeStamp = Date.now() + 60 * 60 * 1000 // 1 hour from now
    const token = createResetToken(email, expTimeStamp)
    return `https://${ROOT_DOMAIN}/reset/${URIencodedEmail}/${expTimeStamp}/${token}`
  } catch (err) {
    console.log(err)
  }
}

export async function createResetLink(email) {
  try {
    const { user } = await import("../user/user.js")
    const foundUser = await user.findOne({
      "email.address": email,
    })
    // check to see if user exists with that email
    if (foundUser) {
      // create email link
      const link = await createResetEmailLink(email)
      return link
    }
    return ""
  } catch (err) {
    console.log(err)
    return false
  }
}
