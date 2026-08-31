require("dotenv").config()
const app=require("./src/app")
const connectdb=require("./src/db/db")
connectdb()

app.listen(3001,()=>{
    console.log("server running in the port 3001")
})