const express=require("express")
const authMiddleware=require("../middlewares/auth.middleware")
const interviewRouter=express.Router()
const interviewController=require("../controllers/interview.controller")
const upload=require("../middlewares/file.middleware")
/**
 * @route POST/api/interview/
 * @description generate a new interview report on the basis on user self description,resume pdf and jobdescription
 * @access private

 */

interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)

/**
 * @route GET/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */
interviewRouter.get("/report/:interviewId",authMiddleware.authUser,interviewController.generateInterviewReportController)


/**
 * @route GET/api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/",authMiddleware.authUser,interviewController.generateInterviewReportController)

module.exports=interviewRouter