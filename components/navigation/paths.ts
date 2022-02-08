export type NavigationPathLink = {
	label: string
	path: string
}

export type NavigationPath = {
	label: string
	iconClasses: string
	path: string
}

export const navigationPaths: Array<NavigationPath> = [
	{
		label: "Home",
		iconClasses: "fal fa-home-alt",
		path: "/",
	},
	{
		label: "Develop",
		iconClasses: "fal fa-desktop",
		path: "/develop",
	},
	{
		label: "Photo",
		iconClasses: "fal fa-camera",
		path: "/photo",
	},
	{
		label: "About",
		iconClasses: "fal fa-user",
		path: "/about",
	},
	{
		label: "Contact",
		iconClasses: "fal fa-envelope",
		path: "/contact",
	},
]
