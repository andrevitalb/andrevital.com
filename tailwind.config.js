const twColors = require("tailwindcss/colors")
const _ = require("lodash")

const colors = _.pick(twColors, ["gray", "red", "green", "black", "white"])

const customColors = {
	...colors,
	gray: {
		100: "#EBEBEB",
		200: "#999999",
		300: "#212121",
		400: "#171717",
		500: "#0E0E0E",
	},
	aqua: {
		100: "#CDFFF5",
		200: "#91FFE9",
		300: "#64FFE1",
		400: "#39FFD8",
		500: "#09FBCC",
	},
	blue: {
		100: "#293D5A",
		200: "#172A45",
		300: "#0A192F",
		400: "#020C1B",
		500: "#01050B",
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
				display: ["Space Grotesk", "sans-serif"],
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
