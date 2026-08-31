const jwt=require("jsonwebtoken")
const blacklistTokenModel=require("../models/blacklist.model")

async function authUser(req,res,next){
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"token not provided or unauthenticated"
        })
    }

    const istokenblacklisted=await blacklistTokenModel.findOne({
        token
    })

    if(istokenblacklisted){
        return res.status(401).json({
            message:"token is invalid"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user=decoded

        next()
        
    }catch(err){
        return res.status(401).json({
            message:"invalid data"
        })
    }
}

module.exports={authUser}