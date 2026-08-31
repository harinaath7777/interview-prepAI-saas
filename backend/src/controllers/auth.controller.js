const userModel=require("../models/user.model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const blacklistTokenModel=require("../models/blacklist.model")

/**
 * @name registerUserController
 * @description register a new user,expects username,email,password in the request body
 * @access public
 */
async function registerUserController(req,res){
    const {username,email,password}=req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message:"please provide username,email,password"
        })
    }

    const isuseralreadyexists=await userModel.findOne({
        $or:[{username},{email}
        ]
    })

    if(isuseralreadyexists){
        return res.status(409).json({
            message:"account already exists with this email or password"
        })
    }

    const hash=await bcrypt.hash(password,10)

    const user=await userModel.create({
        username,email,password:hash

    })

    const token=jwt.sign({
        id:user._id,username:user.username
    },process.env.JWT_SECRET,{expiresIn:"1d"}
    )

    res.cookie("token",token)

    res.status(201).json({
        message:"user registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })


}

/**
 * @name loginUserController 
 * @description login a user,excepts email and password in the request body
 * @access public
 */
async function loginUserController(req,res){
    const {email,password}=req.body

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

    const token=jwt.sign({id:user._id,username:user.username}
        ,process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token)

    res.status(200).json({
        message:"user logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })


    
}

/**
 * @name logoutUserController 
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req,res){
    const token=req.cookies.token
    
    if(token){
        await blacklistTokenModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message:"user logged out successfully"
    })


}

/**
 * @name getmeController
 * @description get the current logged in user details
 * @access private
 */
async function getmeController(req,res){
    const user=await userModel.findById(req.user.id)

    res.status(200).json({
        message:"user details fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}



module.exports={registerUserController,loginUserController,logoutUserController,getmeController}