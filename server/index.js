const express=require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/connectdb')
const router = require('./routes/index')
const cookiesParser = require('cookie-parser')
const { app, server } = require('./socket/index')

//const app = express()
app.use(cors({
    origin: ["http://localhost:3000", "https://mern-project-pj2y.vercel.app"], // ✅ Allows local & deployed frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json())
app.use(cookiesParser())

const PORT = process.env.PORT || 8080

app.get('/',(request,response)=>{
    response.json({
        message: "Server running at " + PORT
    })
})

//api endpoints
app.use('/api',router)

connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log("server running at " + PORT)
    })
})