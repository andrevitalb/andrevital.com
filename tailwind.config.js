const twColors = require("tailwindcss/colors")
const _ = require("lodash")

const colors = _.pick(twColors, ["gray", "red", "green", "black", "white"])

const customColors = {
	...colors,
	gray: {
		200: "#EBEBEB",
		300: "#999999",
		400: "#212121",
		500: "#0E0E0E",
	},
}

module.exports = {
	content: [
		"./src/pages/**/*.ts",
		"./src/pages/**/*.tsx",
		"./src/components/**/*.ts",
		"./src/components/**/*.tsx",
	],
	theme: {
		extend: {
			fontFamily: {
				display: ["Poppins", "sans-serif"],
				body: ["Source Sans Pro", "sans-serif"],
				mono: [
					"Menlo",
					"Monaco",
					"Lucida Console",
					"Liberation Mono",
					"DejaVu Sans Mono",
					"Bitstream Vera Sans Mono",
					"Courier New",
					"monospace",
				],
			},
			colors: customColors,
			animation: {
				spinner: "spinner 1.5s linear infinite",
			},
			keyframes: {
				spinner: {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
			},
		},
	},
	plugins: [require("@tailwindcss/typography", "@tailwindcss/custom-forms")],
}
