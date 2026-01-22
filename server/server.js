const express = require("express")
const dotenv = require("dotenv").config()
const cors = require('cors')
const cookieParser = require("cookie-parser")
const app = express()
const authRoutes = require('./routes/authRoutes')
const messageRoutes = require('./routes/messageRoutes')
const connectDB = require('./config/db')


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
const port = process.env.PORT
connectDB()

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(port, () => {
    console.log(`Server is running in port ${port}`)
})