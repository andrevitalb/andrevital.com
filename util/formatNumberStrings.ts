export const formatTwoDigitNumber = (initialValue: string | number) =>
	`${+initialValue < 10 ? "0" : ""}${initialValue}`
