import * as dotenv from "dotenv"
import path from "path"
dotenv.config()

// Import the 'express' module
import express from "express"

// Create an Express application
const app = express()

// Set the port number for the server
const port = 3000

// Define a route for the root path ('/')
app.get("/", (req, res) => {
  // Send a response to the client

  res.send(
    `Hello, TypeScript + Node.js + Express!.BOT_TOKEN:${process.env.BOT_TOKEN}, ${typeof process.env.MAX_FILE_SIZE_MB} ${path.extname("myFile.mP4").toLowerCase()}`,
  )
})

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`)
})
