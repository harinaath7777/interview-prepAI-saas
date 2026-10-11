import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {
        loading,
        setLoading,
        downloadingPdf,
        setDownloadingPdf,
        report,
        setReport,
        reports,
        setReports
    } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            if (response && response.interviewReport) {
                setReport(response.interviewReport)
            }
        } catch (error) {
            console.error("Error generating report:", error)
            throw error
        } finally {
            setLoading(false)
        }
        return response ? response.interviewReport : null
    }

    const getReportById = async (id) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(id)
            if (response && response.interviewReport) {
                setReport(response.interviewReport)
            }
        } catch (error) {
            console.error("Error getting report by id:", error)
        } finally {
            setLoading(false)
        }
        return response ? response.interviewReport : null
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            if (response && response.interviewReports) {
                setReports(response.interviewReports)
            }
        } catch (error) {
            console.error("Error getting reports:", error)
        } finally {
            setLoading(false)
        }
        return response ? response.interviewReports : []
    }

    const previewResumePdf = async (interviewReportId) => {
        setDownloadingPdf(true)
        try {
            const data = await generateResumePdf({ interviewReportId })
            const blob = data instanceof Blob ? data : new Blob([ data ], { type: "application/pdf" })
            const url = window.URL.createObjectURL(blob)
            window.open(url, "_blank")
            setTimeout(() => {
                try {
                    window.URL.revokeObjectURL(url)
                } catch (e) {}
            }, 60000)
        } catch (error) {
            console.error("Error previewing resume pdf:", error)
            alert("Error previewing resume PDF: " + (error.message || "Please try again."))
        } finally {
            setDownloadingPdf(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setDownloadingPdf(true)
        try {
            const data = await generateResumePdf({ interviewReportId })

            // Check if server returned an error JSON packaged as a blob
            if (data instanceof Blob && (data.type === "application/json" || data.type.includes("json"))) {
                const text = await data.text()
                let errorMsg = "Failed to generate resume PDF"
                try {
                    const parsed = JSON.parse(text)
                    errorMsg = parsed.message || errorMsg
                } catch (e) {}
                alert("Error: " + errorMsg)
                return
            }

            const fileName = `optimized_resume_${interviewReportId}.pdf`
            const blob = data instanceof Blob ? data : new Blob([ data ], { type: "application/pdf" })

            // Use FileReader to convert to Data URL
            // This prevents Chromium/Edge from assigning the internal blob UUID as the filename
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64data = reader.result
                const link = document.createElement("a")
                link.href = base64data
                link.download = fileName
                link.setAttribute("download", fileName)
                // Avoid display: none so Chromium registers element as active in DOM
                link.style.position = "fixed"
                link.style.top = "0"
                link.style.left = "0"
                link.style.opacity = "0.01"
                link.style.pointerEvents = "none"
                document.body.appendChild(link)

                link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }))

                setTimeout(() => {
                    try {
                        if (document.body.contains(link)) {
                            document.body.removeChild(link)
                        }
                    } catch (e) {}
                }, 2000)
            }
            reader.readAsDataURL(blob)
        } catch (error) {
            console.error("Error generating resume pdf:", error)
            let errMsg = error.message || "Please check server logs and try again."
            if (error.response?.data instanceof Blob) {
                try {
                    const text = await error.response.data.text()
                    const parsed = JSON.parse(text)
                    if (parsed.message) errMsg = parsed.message
                } catch (e) {}
            }
            alert("Error downloading resume PDF: " + errMsg)
        } finally {
            setDownloadingPdf(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return {
        loading,
        downloadingPdf,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf,
        previewResumePdf
    }
}
