const baseLogoVariant = {
	animate: {
		strokeDashoffset: 0,
	},
}

export const mainLogoAnimation = {
	...baseLogoVariant,
	initial: {
		strokeDasharray: 1745.76,
		strokeDashoffset: 1745.76,
	},
}

export const lineLogoAnimation = {
	...baseLogoVariant,
	initial: {
		strokeDasharray: 1804.96,
		strokeDashoffset: 1804.96,
	},
}

export const logoTransition = {
	duration: 2.25,
	ease: "easeInOut",
}
