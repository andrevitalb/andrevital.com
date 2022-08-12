module.exports = {
	extends: [
		"plugin:prettier/recommended",
		"plugin:promise/recommended",
		"plugin:jest/recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
	],
	rules: { "@typescript-eslint/no-unused-vars": "off" },
}
