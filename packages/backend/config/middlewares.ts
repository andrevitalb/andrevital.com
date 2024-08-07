export default ({ env }) => [
	"strapi::errors",
	"strapi::cors",
	"strapi::poweredBy",
	"strapi::logger",
	"strapi::query",
	"strapi::body",
	"strapi::session",
	"strapi::favicon",
	"strapi::public",
	{
		name: "strapi::security",
		config: {
			contentSecurityPolicy: {
				useDefaults: true,
				directives: {
					"connect-src": ["'self'", "https:"],
					"img-src": [
						"'self'",
						"data:",
						"blob:",
						"dl.airtable.com",
						`${env("AWS_BUCKET_NAME")}.s3.${env("AWS_REGION")}.amazonaws.com`,
					],
					"media-src": [
						"'self'",
						"data:",
						"blob:",
						"dl.airtable.com",
						`${env("AWS_BUCKET_NAME")}.s3.${env("AWS_REGION")}.amazonaws.com`,
					],
					upgradeInsecureRequests: null,
				},
			},
		},
	},
]
