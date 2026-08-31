const {GoogleGenAI}=require("@google/genai")
const {z}=require("zod")


const ai=new GoogleGenAI({
    apiKey:process.env.API_KEY
})

async function invokeGeminiAi(){
    const response=await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:"hello gemini! explain what is interview"
    })
    console.log(response.text)
}

const interviewReportSchema=z.object({
    matchScore:z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        questions:z.string().describe("The technical questions can be asked in the interview"),
        intention:z.string().describe("The intention of interviewer behind asking this question"),
        answer:z.string().describe("How to answer this question,what points to cover,what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        questions:z.string().describe("The technical questions can be asked in the interview"),
        intention:z.string().describe("The intention of interviewer behind asking this question"),
        answer:z.string().describe("How to answer this question,what points to cover,what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill:z.string().describe("The skill which the candidate is lacking"),
        severity:z.enum(["low","medium","high"]).describe("The severity pf this skill gap")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan:z.array(z.object({
        day:z.number().describe("The day number in the prepration plan,starting from 1"),
        focus:z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks:z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or solve a set of problems.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively."),
    title:z.string().describe("The title of the job for which the interview report is generated"),
})


async function generateInterviewReport({resume,selfDescription,jobDescription}){
    console.log("Using interviewReportSchema");
    const prompt = `
Generate an interview report for a candidate with the following details:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;
    
    const response=await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:prompt,
        config:{
            responseMimeType:"application/json",
            responseJsonSchema:z.toJSONSchema(interviewReportSchema),
        }
    })
    
    return JSON.parse(response.text)
}

module.exports=generateInterviewReport