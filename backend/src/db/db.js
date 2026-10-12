const mongoose=require("mongoose")

async function connectdb(){
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection
    }

    if (mongoose.connection.readyState === 2) {
        let attempts = 0
        while (mongoose.connection.readyState === 2 && attempts < 25) {
            await new Promise(r => setTimeout(r, 200))
            attempts++
        }
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection
        }
    }

    if (!process.env.MONGO_URI) {
        console.error("[db] MONGO_URI is missing!")
        throw new Error("MONGO_URI environment variable is not defined in Vercel settings")
    }

    try{
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            bufferCommands: false
        })

        console.log("connected to database")
        return mongoose.connection
    }catch(err){
        console.error("MongoDB connection error:", err.message)
        throw err
    }
}

module.exports=connectdb