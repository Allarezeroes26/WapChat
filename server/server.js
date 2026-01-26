const express = require("express")
const dotenv = require("dotenv").config()
const cors = require('cors')
const cookieParser = require("cookie-parser")
const authRoutes = require('./routes/authRoutes')
const messageRoutes = require('./routes/messageRoutes')
const connectDB = require('./config/db')
const { app, server } = require("./config/socket")

app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({extended: true, limit: "10mb"}))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
const port = process.env.PORT || 5003
connectDB()

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

server.listen(port, () => {
    console.log(`Server is running in port ${port}`)
})