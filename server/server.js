const express = require("express")
const dotenv = require("dotenv").config()
const app = express()
const authRoutes = require('./routes/authRoutes')
const connectDB = require('./config/db')

const port = process.env.PORT
connectDB()

app.use("/api/auth", authRoutes)

app.listen(port, () => {
    console.log(`Server is running in port ${port}`)
})