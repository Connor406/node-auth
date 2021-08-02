import { client } from "../db.js"

export const user = client.db("test").collection("user")

// await user.createIndex({ "email.address": 1 })
