import { TQuestion } from "@/types/application.type";


export interface IApplication {
    resume: String,
    jobId?: string
    questions?: TQuestion[],
    notice_period?: String,
    start_date?: String
}