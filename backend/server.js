require("dotenv").config()
const app=require("./src/app")
const connectdb=require("./src/db/db")
connectdb()

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`server running in the port ${PORT}`)
})

module.exports = app