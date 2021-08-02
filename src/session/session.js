import { client } from "../db.js"

export const session = client.db("test").collection("session")
// await session.createIndex({ sessionToken: 1 })
