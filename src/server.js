const autoLoad = require("@fastify/autoload");
const fp = require("fastify-plugin");
const path = require("upath");

// Import plugins
const accepts = require("@fastify/accepts");
const basic = require("@fastify/basic-auth");
const compress = require("@fastify/compress");
const disableCache = require("fastify-disablecache");
const flocOff = require("fastify-floc-off");
const helmet = require("@fastify/helmet");
const rateLimit = require("@fastify/rate-limit");
const sensible = require("@fastify/sensible");
const serialiseJsonToXml = require("fastify-json-to-xml");
const staticPlugin = require("@fastify/static");
const swagger = require("@fastify/swagger");
const underPressure = require("@fastify/under-pressure");
const clean = require("./plugins/clean-object");
const convertDateParamOperator = require("./plugins/convert-date-param-operator");
const db = require("./plugins/db");
const hashedBearerAuth = require("./plugins/hashed-bearer-auth");
const sharedSchemas = require("./plugins/shared-schemas");

/**
 * @author Frazer Smith
 * @description Build Fastify instance.
 * @param {object} server - Fastify instance.
 * @param {object} config - Fastify configuration values.
 */
async function plugin(server, config) {
	// Register plugins
	await server
		// Accept header handler
		.register(accepts)

		// Support Content-Encoding
		.register(compress, { inflateIfDeflated: true })

		// Database connection
		.register(db, config.database)

		// Set response headers to disable client-side caching
		.register(disableCache)

		// Opt-out of Google's FLoC advertising-surveillance network
		.register(flocOff)

		// Use Helmet to set response security headers: https://helmetjs.github.io/
		.register(helmet, config.helmet)

		// Utility functions and error handlers
		.register(sensible)

		// Serialisation support for XML responses
		.register(serialiseJsonToXml)

		// Reusable schemas
		.register(sharedSchemas)

		// Generate OpenAPI/Swagger definitions
		.register(swagger, config.swagger)

		// Process load and 503 response handling
		.register(underPressure, config.processLoad)

		// Additional utility functions
		.register(clean)
		.register(convertDateParamOperator)

		// Rate limiting and 429 response handling
		.register(rateLimit, config.rateLimit);

	// Register routes
	await server
		/**
		 * Helmet sets `x-xss-protection` and `content-security-policy` by default.
		 * These are only useful for HTML/XML content; the only CSP directive that
		 * is of use to other content is "frame-ancestors 'none'" to stop responses
		 * from being wrapped in iframes and used for clickjacking attacks
		 */
		.addHook("onSend", async (_req, res, payload) => {
			if (
				!res.getHeader("content-type")?.includes("html") &&
				!res.getHeader("content-type")?.includes("xml")
			) {
				res.header(
					"content-security-policy",
					"default-src 'self';frame-ancestors 'none'"
				);
				res.raw.removeHeader("x-xss-protection");
			}
			return payload;
		})

		// Import and register healthcheck route
		.register(autoLoad, {
			dir: path.joinSafe(__dirname, "routes", "admin", "healthcheck"),
			options: { ...config, prefix: "admin/healthcheck" },
		})

		/**
		 * Encapsulate plugins and routes into child context, so that other
		 * routes do not inherit `accepts` preHandler.
		 * See https://fastify.io/docs/latest/Reference/Encapsulation/ for more info
		 */
		.register(async (serializedContext) => {
			serializedContext
				// Catch unsupported Accept header media types
				.addHook("onRequest", async (req) => {
					if (
						!req
							.accepts()
							.type(["application/json", "application/xml"])
					) {
						throw server.httpErrors.notAcceptable();
					}
				});

			await serializedContext
				/**
				 * Encapsulate plugins and routes into secured child context, so that other
				 * routes do not inherit bearer token auth plugin (if enabled)
				 */
				.register(async (securedContext) => {
					// Protect routes with Bearer token auth if enabled
					if (config.bearerTokenAuthEnabled) {
						await securedContext.register(hashedBearerAuth);
					}
					await securedContext
						// Import and register service routes
						.register(autoLoad, {
							dir: path.joinSafe(__dirname, "routes"),
							ignorePattern: /(admin|docs)/,
							options: config,
						});
				})

				/**
				 * Encapsulate the admin/access routes into a child context, so that the other
				 * routes do not inherit basic auth plugin
				 */
				.register(async (adminContext) => {
					await adminContext
						// Protect routes with Basic auth
						.register(basic, {
							validate: async (username, password) => {
								if (
									username !== config.admin.username ||
									password !== config.admin.password
								) {
									throw server.httpErrors.unauthorized();
								}
							},
							authenticate: false,
						});

					adminContext.addHook("onRequest", adminContext.basicAuth);

					await adminContext
						// Import and register service routes
						.register(autoLoad, {
							dir: path.joinSafe(__dirname, "routes", "admin"),
							ignorePattern: /(healthcheck)/,
							options: { ...config, prefix: "admin" },
						});
				});
		})

		/**
		 * Encapsulate the docs routes into a child context, so that the
		 * CSP can be relaxed, and cache enabled, without affecting
		 * security of other routes
		 */
		.register(async (publicContext) => {
			const relaxedHelmetConfig = structuredClone(config.helmet);
			Object.assign(
				relaxedHelmetConfig.contentSecurityPolicy.directives,
				{
					"script-src": ["'self'", "'unsafe-inline'"],
					"style-src": ["'self'", "'unsafe-inline'"],
				}
			);

			await publicContext
				// Set relaxed response headers
				.register(helmet, relaxedHelmetConfig)

				// Stop fastify-disablecache overwriting @fastify/static's cache headers
				.addHook("onRequest", async (_req, res) => {
					res.removeHeader("cache-control")
						.removeHeader("expires")
						.removeHeader("pragma")
						.removeHeader("surrogate-control");
				})

				// Register static files in public
				.register(staticPlugin, {
					root: path.joinSafe(__dirname, "public"),
					immutable: true,
					maxAge: "365 days",
					prefix: "/public/",
					wildcard: false,
				})
				.register(autoLoad, {
					dir: path.joinSafe(__dirname, "routes", "docs"),
					options: { ...config, prefix: "docs" },
				});
		})

		// Rate limit 404 responses
		.setNotFoundHandler(
			{
				preHandler: server.rateLimit(),
			},
			(req, res) => {
				res.notFound(`Route ${req.method}:${req.url} not found`);
			}
		)

		// Errors thrown by routes and plugins are caught here
		.setErrorHandler(async (err, _req, res) => {
			/**
			 * Catch 5xx errors, log them, and return a generic 500
			 * response. This avoids leaking internal server error details
			 * to the client
			 */
			if (
				(err.statusCode >= 500 &&
					/* istanbul ignore next: under-pressure plugin throws valid 503s */
					err.statusCode !== 503) ||
				/**
				 * Uncaught errors will have a res.statusCode but not
				 * an err.statusCode as @fastify/sensible sets that
				 */
				(res.statusCode === 200 && !err.statusCode)
			) {
				res.log.error(err);
				throw server.httpErrors.internalServerError();
			}

			throw err;
		});
}

module.exports = fp(plugin, { fastify: "4.x", name: "server" });
