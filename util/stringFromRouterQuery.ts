import { NextRouter } from "next/router"

export const stringFromRouterQuery = (
	router: NextRouter,
	fieldName: string,
	defaultValue?: string,
): string | null => {
	const raw = router.query[fieldName]

	return typeof raw === "string" ? raw : defaultValue ?? null
}
