import mongo from "mongodb"

const { MongoClient } = mongo

const url = process.env.MONGO_URL

export const client = new MongoClient(url, { useNewUrlParser: true })

export async function connectDb() {
  try {
    await client.connect()

    // confirms connection
    await client.db("admin").command({ ping: 1 })
    console.log("🗂 Connected to DB! Woohoo!!")
  } catch (e) {
    console.error(e)
    // if problem => close DB connection
    await client.close()
  }
}
