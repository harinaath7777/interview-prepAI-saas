const express=require("express")
const cookieParser=require("cookie-parser")
const cors=require("cors")
const connectdb=require("./db/db")
const app=express()

app.set("trust proxy", 1)

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map(url => url.trim()) : [])
]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true)
        }
        return callback(null, true)
    },
    credentials: true,
    exposedHeaders: ["Content-Disposition"]
}))
app.get("/api/health", (req, res) => {
    const mongoose = require("mongoose")
    const states = ["disconnected", "connected", "connecting", "disconnecting"]
    res.json({
        status: "ok",
        database: states[mongoose.connection.readyState] || "unknown",
        hasMongoUri: !!process.env.MONGO_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV || "development"
    })
})

app.use(async (req, res, next) => {
    try {
        await connectdb()
        next()
    } catch (err) {
        return res.status(500).json({
            message: "Database connection failed: " + (err.message || "Please ensure MONGO_URI is configured correctly in Vercel.")
        })
    }
})

const authRouter=require("./routes/auth.routes")
const interviewRouter=require("./routes/interview.routes")

/*use all the routes here*/
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)
module.exports=app