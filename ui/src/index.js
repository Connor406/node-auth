import fastify from "fastify"
import fastifyStatic from "fastify-static"
import { fileURLToPath } from "url"
import path from "path"

// ESM specific things
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = fastify()

async function startApp() {
  try {
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    })

    const PORT = 5000
    await app.listen(PORT)
    console.log(`🚀 Server listening at port: ${PORT}`)
  } catch (err) {
    console.log(err)
  }
}

startApp()
