import https from "https"
import fastify from "fastify"
import fastifyStatic from "fastify-static"
import fetch from "cross-fetch"
import { fileURLToPath } from "url"
import path from "path"

// ESM specific things
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = fastify()

async function startApp() {
  try {
    // REGISTERS
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    })

    // ROUTES
    app.get("/verify/:email/:token", {}, async (request, reply) => {
      try {
        const { email, token } = request.params
        const values = {
          email,
          token,
        }
        // Fixes credential error
        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
        })

        const res = await fetch("https://api.nodeauth.dev/api/verify", {
          method: "POST",
          body: JSON.stringify(values),
          credentials: "include",
          agent: httpsAgent,
          headers: { "Content-type": "application/json; charset=UTF-8" },
        })
        if (res.status === 200) {
          return reply.redirect("/")
        }
        reply.code(401).send()
      } catch (err) {
        reply.send(err)
      }
    })

    app.get("/reset/:email/:exp/:token", {}, async (request, reply) => {
      return reply.sendFile("reset.html") // pushes router to reset.html file
    })

    app.get("/2fa", {}, async (request, reply) => {
      reply.sendFile("2fa.html")
    })

    // SERVER STUFF
    const PORT = 5000
    await app.listen(PORT)
    console.log(`🚀 Server listening at port: ${PORT}`)
  } catch (err) {
    console.log(err)
  }
}

startApp()
