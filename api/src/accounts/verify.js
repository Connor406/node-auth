import crypto from "crypto"
const { ROOT_DOMAIN, JWT_SECRET } = process.env

export async function createVerifyEmailToken(email) {
  try {
    // Auth string, JWT Secret, email
    const authString = `${JWT_SECRET}:${email}`
    return crypto.createHash("sha256").update(authString).digest("hex")
  } catch (err) {
    console.log(err)
  }
}

export async function createVerifyEmailLink(email) {
  try {
    // Create token
    const emailToken = await createVerifyEmailToken(email)
    // Encode url string
    const URIencodedEmail = encodeURIComponent(email)
    // Return link for verification
    return `https://${ROOT_DOMAIN}/verify/${URIencodedEmail}/${emailToken}`
  } catch (err) {
    console.log(err)
  }
}

export async function validateVerifyEmail(token, email) {
  try {
    console.log(token, email)
    // Create a hash
    const emailToken = await createVerifyEmailToken(email)
    // Compare hash with token
    const isValid = emailToken === token
    if (isValid) {
      // If successful, update user to make them verified
      const { user } = await import("../user/user.js")
      await user.updateOne(
        {
          "email.address": email,
        },
        {
          $set: { "email.verified": true },
        }
      )
      // Return success
      return true
    }
    return false
  } catch (err) {
    console.log(err)
    return false
  }
}
