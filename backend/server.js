require("dotenv").config()
const app = require("./src/app")
const connectdb = require("./src/db/db")

// Only run startup connectdb if MONGO_URI is defined
if (process.env.MONGO_URI) {
    connectdb().catch(err => console.error("Initial connectdb error:", err.message))
}

const PORT = process.env.PORT || 3001

// In serverless environments (like Vercel), the platform routes invocations directly to the exported handler
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`server running in the port ${PORT}`)
    })
}

module.exports = app