const mongoose=require("mongoose")

async function connectdb(){
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection
    }

    if (!process.env.MONGO_URI) {
        console.error("[db] MONGO_URI is missing!")
        throw new Error("MONGO_URI environment variable is not defined")
    }

    try{
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        })

        console.log("connected to database")
        return mongoose.connection
    }catch(err){
        console.error("MongoDB connection error:", err.message)
        throw err
    }
}

module.exports=connectdb