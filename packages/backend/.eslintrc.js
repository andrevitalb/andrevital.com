module.exports = {
	extends: [
		"../.eslintrc.base.js",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
	],
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: "./tsconfig.json",
	},
	env: {
		node: true,
	},
	plugins: ["import"],
	rules: {
		"import/no-anonymous-default-export": "off",
	},
	overrides: [
		{
			files: ["*.ts"],
			rules: {
				"@typescript-eslint/explicit-function-return-type": ["off"],
				"@typescript-eslint/explicit-module-boundary-types": ["off"],
			},
		},
	],
	globals: {
		strapi: true,
	},
}
