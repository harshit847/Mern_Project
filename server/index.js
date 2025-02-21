const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/connectdb')
const router = require('./routes/index')
const cookiesParser = require('cookie-parser')
const { app, server } = require('./socket/index')

const allowedOrigin = process.env.FRONTEND_URL || "https://chat-app-z59a.onrender.com";

// const app = express()
app.use(cors({
    origin : allowedOrigin,
    methods: ["GET", "POST"],
    credentials : true
}))
app.use(express.json())
app.use(cookiesParser())

const PORT = process.env.PORT || 8080

app.get('/',(request,response)=>{
    response.json({
        message : "Server running at " + PORT
    })
})

//api endpoints
app.use('/api',router)

connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log("server running at " + PORT)
    })
})