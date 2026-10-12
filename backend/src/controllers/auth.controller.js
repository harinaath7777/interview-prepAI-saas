const userModel=require("../models/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const blacklistTokenModel=require("../models/blacklist.model")

/**
 * @name registerUserController
 * @description register a new user,expects username,email,password in the request body
 * @access public
 */
async function registerUserController(req,res){
    try {
        const {username,email,password}=req.body

        if(!username || !email || !password){
            return res.status(400).json({
                message:"please provide username,email,password"
            })
        }

        const isuseralreadyexists=await userModel.findOne({
            $or:[{username},{email}]
        })

        if(isuseralreadyexists){
            return res.status(409).json({
                message:"account already exists with this email or username"
            })
        }

        const hash=await bcrypt.hash(password,10)

        const user=await userModel.create({
            username,email,password:hash
        })

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET environment variable is not defined")
            return res.status(500).json({
                message: "Server configuration error: JWT_SECRET is missing"
            })
        }

        const token=jwt.sign({
            id:user._id,username:user.username
        },process.env.JWT_SECRET,{expiresIn:"1d"})

        const isHttps = process.env.NODE_ENV === "production" || req.headers["x-forwarded-proto"] === "https" || req.secure
        res.cookie("token",token,{
            httpOnly:true,
            secure:isHttps,
            sameSite:"lax",
            path:"/",
            maxAge:24*60*60*1000
        })

        return res.status(201).json({
            message:"user registered successfully",
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        })
    }catch(err){
        console.error("Error in registerUserController:", err)
        return res.status(500).json({
            message: err.message || "Internal server error during registration"
        })
    }
}

/**
 * @name loginUserController 
 * @description login a user,excepts email and password in the request body
 * @access public
 */
async function loginUserController(req,res){
    try {
        const {email,password}=req.body

        if(!email || !password){
            return res.status(400).json({
                message:"please provide email and password"
            })
        }

        const user=await userModel.findOne({email})

        if(!user){
            return res.status(401).json({
                message:"invalid email or password"
            })
        }

        const ispasswordvalid=await bcrypt.compare(password,user.password)

        if(!ispasswordvalid){
            return res.status(401).json({
                message:"invalid email or password"
            })
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET environment variable is not defined")
            return res.status(500).json({
                message: "Server configuration error: JWT_SECRET is missing"
            })
        }

        const token=jwt.sign({id:user._id,username:user.username}
            ,process.env.JWT_SECRET,{expiresIn:"1d"})

        const isHttps = process.env.NODE_ENV === "production" || req.headers["x-forwarded-proto"] === "https" || req.secure
        res.cookie("token",token,{
            httpOnly:true,
            secure:isHttps,
            sameSite:"lax",
            path:"/",
            maxAge:24*60*60*1000
        })

        return res.status(200).json({
            message:"user logged in successfully",
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        })
    }catch(err){
        console.error("Error in loginUserController:", err)
        return res.status(500).json({
            message: err.message || "Internal server error during login"
        })
    }
}

/**
 * @name logoutUserController 
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req,res){
    try {
        const authHeader = req.headers.authorization
        const bearerToken = authHeader ? (authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim()) : null
        const token=req.cookies.token || bearerToken
        
        if(token){
            await blacklistTokenModel.create({token})
        }

        const isHttps = process.env.NODE_ENV === "production" || req.headers["x-forwarded-proto"] === "https" || req.secure
        res.clearCookie("token",{
            httpOnly:true,
            secure:isHttps,
            sameSite:"lax",
            path:"/"
        })

        return res.status(200).json({
            message:"user logged out successfully"
        })
    }catch(err){
        console.error("Error in logoutUserController:", err)
        return res.status(500).json({
            message: err.message || "Error during logout"
        })
    }
}

/**
 * @name getmeController
 * @description get the current logged in user details
 * @access private
 */
async function getmeController(req,res){
    try {
        const user=await userModel.findById(req.user.id).select("-password")

        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }

        return res.status(200).json({
            message:"user details fetched successfully",
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        })
    }catch(err){
        console.error("Error in getmeController:", err)
        return res.status(500).json({
            message: err.message || "Error fetching user details"
        })
    }
}



module.exports={registerUserController,loginUserController,logoutUserController,getmeController}