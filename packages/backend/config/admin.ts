export default ({ env }) => ({
	apiToken: {
		salt: env("API_TOKEN_SALT"),
	},
	auth: {
		secret: env("ADMIN_JWT_SECRET", "fc6328d2b0514ff901f2ff2640f46d12"),
	},
})
