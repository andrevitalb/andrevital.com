import { createContext, ReactNode, useContext, useState } from "react"
import { cvData } from "services/cvData"

export interface JobDate {
	month: string
	year: string
}

export interface CVEntry {
	id: string
	companyName: string
	companyPageUrl: string
	position: string
	location: string
	startDate: JobDate
	endDate: JobDate
	descriptionBullets: string[][]
}

const CVContext = createContext<CVEntry[]>([])

export const useCV = (): CVEntry[] => {
	return useContext(CVContext)
}

export const CVProvider = ({ children }: { children: ReactNode }) => {
	const [cvEntries] = useState<CVEntry[]>(cvData)

	return <CVContext.Provider value={cvEntries}>{children}</CVContext.Provider>
}
