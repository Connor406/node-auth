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
import { logUserOut } from "./accounts/logUserOut.js"
import { getUserFromCookie } from "./accounts/user.js"

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
        if (userId) {
          await logUserIn(userId, request, reply)
          reply.send({
            data: {
              status: "Successfully logged in",
            },
          })
        }
      } catch (e) {
        console.log(e)
        reply.send({
          data: {
            status: "Could not log in",
          },
        })
      }
    })

    app.post("/api/logout", {}, async (request, reply) => {
      try {
        await logUserOut(request, reply)
        reply.send({
          data: "logged user out",
        })
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
        reply.send({
          data: {
            status: "successfully logged in",
          },
        })
      } catch (e) {
        console.log(e)
        reply.send({
          data: {
            status: "Could not log user in",
          },
        })
      }
    })

    app.get("/test", {}, async (request, reply) => {
      try {
        // verify user login
        const user = await getUserFromCookie(request, reply)
        // return user email, if it exists, otherwise return unauthorized
        if (user._id) {
          reply.send({ data: user })
        } else {
          reply.send({ data: "user lookup failed" })
        }
      } catch (e) {
        throw new Error(e)
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
