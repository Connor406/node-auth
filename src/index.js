import "./env.js"
import { fastify } from "fastify"
import fastifyStatic from "fastify-static"
import path from "path"
import { fileURLToPath } from "url"
import { connectDb } from "./db.js"
import { registerUser } from "./accounts/register.js"
import { authorizeUser } from "./accounts/authorize.js"
import fastifyCookie from "fastify-cookie"
import { logUserIn } from "./accounts/logUserIn.js"

// ESM specific things
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = fastify()

async function startApp() {
  try {
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET,
    })

    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    })

    app.post("/api/register", {}, async (request, reply) => {
      try {
        const userId = await registerUser(request.body.email, request.body.password)
      } catch (e) {
        console.log(e)
      }
    })

    app.post("/api/authorize", {}, async (request, reply) => {
      try {
        const { isAuthorized, userId } = await authorizeUser(
          request.body.email,
          request.body.password
        )
        if (isAuthorized) {
          await logUserIn(userId, request, reply)
        }
        // generate auth tokens
        // set cookie
        reply
          .setCookie("testCookie", "the value is this", {
            httpOnly: true,
            path: "/",
            domain: "localhost",
          })
          .send({ data: "nice" })
      } catch (e) {
        console.log(e)
      }
    })

    await app.listen(3000)
    console.log("🚀 Server listening at port: 3000")
  } catch (err) {
    console.error(err)
  }
}

connectDb().then(() => {
  startApp()
})
