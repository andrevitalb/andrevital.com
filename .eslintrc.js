module.exports = {
	extends: [
		"react-app",
		"plugin:prettier/recommended",
		"plugin:promise/recommended",
	],
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: "./tsconfig.json",
	},
	env: {
		node: true,
	},
	rules: {
		"@typescript-eslint/no-unused-vars": "off",
		"react/react-in-jsx-scope": "off",
		"jsx-a11y/anchor-is-valid": "off",
	},
	overrides: [
		{
			files: ["*.tsx"],
			rules: {
				"@typescript-eslint/explicit-function-return-type": ["off"],
				"@typescript-eslint/explicit-module-boundary-types": ["off"],
			},
		},
	],
}
