require("dotenv").config()
const app=require("./src/app")
const connectdb=require("./src/db/db")
connectdb().catch(err => console.error("Initial connectdb error:", err.message))

const PORT = process.env.PORT || 3001

if (process.env.NODE_ENV !== "production" || require.main === module) {
    app.listen(PORT, () => {
        console.log(`server running in the port ${PORT}`)
    })
}

module.exports = app