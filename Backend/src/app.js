const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "https://ai-interview-assistant-htst.onrender.com",
    credentials: true
}))

/* require all the routes here*/
const authRouther = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')

/* using all the routes here*/
app.use("/api/auth",authRouther)
app.use("/api/interview",interviewRouter)

module.exports = app
