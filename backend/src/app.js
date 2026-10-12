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
app.use(async (req, res, next) => {
    try {
        await connectdb()
        next()
    } catch (err) {
        return res.status(500).json({
            message: "Database connection failed. Please ensure MONGO_URI is configured correctly in Vercel."
        })
    }
})

/* require all the routes here*/
const authRouter=require("./routes/auth.routes")
const interviewRouter=require("./routes/interview.routes")

/*use all the routes here*/
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)
module.exports=app