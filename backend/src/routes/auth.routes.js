const {Router}=require("express")
const authController=require("../controllers/auth.controller")
const authRouter=Router()
const authMiddleware=require("../middlewares/auth.middleware")

/**
 * @route POST api/auth/register
 * @desacription Register a new user
 * @access Public
 */
authRouter.post("/register",authController.registerUserController )

/**
 * @route POST api/auth/login
 * @desacription login user with email and password
 * @access Public
 */
authRouter.post("/login",authController.loginUserController)

/**
 * @route GET api/auth/logout
 * @desacription clear token from user cookie and add the token in blacklist
 * @access Public
 */
authRouter.get("/logout",authController.logoutUserController)

/**
 * @route GET api/auth/get-me
 * @desacription get the current logged in user details
 * @access Private
 */
authRouter.get("/get-me",authMiddleware.authUser,authController.getmeController)

module.exports=authRouter