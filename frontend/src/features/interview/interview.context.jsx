import { createContext, useState } from "react";

export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [downloadingPdf, setDownloadingPdf] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    return (
        <InterviewContext.Provider value={{
            loading,
            setLoading,
            downloadingPdf,
            setDownloadingPdf,
            report,
            setReport,
            reports,
            setReports
        }}>
            {children}
        </InterviewContext.Provider>
    )
}
