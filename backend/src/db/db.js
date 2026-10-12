const mongoose=require("mongoose")

async function connectdb(){

    try{
        if (mongoose.connection.readyState >= 1) {
            return
        }
        await mongoose.connect(process.env.MONGO_URI)

    console.log("connected to database")
    }catch(err){
        console.log(err)
    }
}

module.exports=connectdb