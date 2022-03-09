const faker = require("faker/locale/en_GB");
const fs = require("fs").promises;
const glob = require("glob");
const getConfig = require(".");

describe("Configuration", () => {
	const currentEnv = { ...process.env };

	beforeAll(() => {
		jest.resetModules();
	});

	afterAll(async () => {
		const files = glob.sync(`./test_resources/test-log*`);

		// eslint-disable-next-line security/detect-non-literal-fs-filename
		await Promise.all(files.map((file) => fs.unlink(file)));
	});

	afterEach(() => {
		// Reset the process.env to default after each test
		jest.resetModules();
		Object.assign(process.env, currentEnv);
	});

	test("Should use defaults if values missing and return values according to environment variables", async () => {
		const NODE_ENV = "development";
		const SERVICE_HOST = faker.internet.ip();
		const SERVICE_PORT = faker.datatype.number();
		const CORS_ORIGIN = "";
		const CORS_ALLOWED_HEADERS = "";
		const CORS_ALLOW_CREDENTIALS = "";
		const CORS_EXPOSED_HEADERS = "";
		const CORS_MAX_AGE = "";
		const HTTPS_SSL_CERT_PATH = "";
		const HTTPS_SSL_KEY_PATH = "";
		const HTTPS_HTTP2_ENABLED = "";
		const LOG_LEVEL = "";
		const LOG_ROTATION_DATE_FORMAT = "";
		const LOG_ROTATION_FILENAME = "./test_resources/test-log-%DATE%.log";
		const LOG_ROTATION_FREQUENCY = "";
		const PROC_LOAD_MAX_EVENT_LOOP_DELAY = "";
		const PROC_LOAD_MAX_EVENT_LOOP_UTILIZATION = "";
		const PROC_LOAD_MAX_HEAP_USED_BYTES = "";
		const PROC_LOAD_MAX_RSS_BYTES = "";
		const RATE_LIMIT_MAX_CONNECTIONS_PER_MIN = "";
		const RATE_LIMIT_EXCLUDED_ARRAY = '["127.0.0.1"]';
		const ADMIN_USERNAME = "admin";
		const ADMIN_PASSWORD = "password";
		const BEARER_TOKEN_AUTH_ENABLED = "";
		const DB_CLIENT = "";
		const DB_CONNECTION_STRING =
			"Server=localhost,1433;Database=database;User Id=username;Password=password;Encrypt=true";
		const DB_DOCUMENT_REGISTER_TABLE = "YDHAPPDOC.dbo.SPINDEX";
		const DB_PATIENT_PREFERENCES_TABLE = "patient.preferences";
		const DB_PATIENT_PREFERENCES_TYPE_TABLE = "lookup.preferenceType";
		const DB_PATIENT_PREFERENCES_VALUE_TABLE = "lookup.preferenceValue";
		const DB_READ_RECEIPT_DOCS_TABLE = "receipt.documents";

		Object.assign(process.env, {
			NODE_ENV,
			SERVICE_HOST,
			SERVICE_PORT,
			CORS_ORIGIN,
			CORS_ALLOWED_HEADERS,
			CORS_ALLOW_CREDENTIALS,
			CORS_EXPOSED_HEADERS,
			CORS_MAX_AGE,
			HTTPS_SSL_CERT_PATH,
			HTTPS_SSL_KEY_PATH,
			HTTPS_HTTP2_ENABLED,
			LOG_LEVEL,
			LOG_ROTATION_DATE_FORMAT,
			LOG_ROTATION_FILENAME,
			LOG_ROTATION_FREQUENCY,
			PROC_LOAD_MAX_EVENT_LOOP_DELAY,
			PROC_LOAD_MAX_EVENT_LOOP_UTILIZATION,
			PROC_LOAD_MAX_HEAP_USED_BYTES,
			PROC_LOAD_MAX_RSS_BYTES,
			RATE_LIMIT_MAX_CONNECTIONS_PER_MIN,
			RATE_LIMIT_EXCLUDED_ARRAY,
			ADMIN_USERNAME,
			ADMIN_PASSWORD,
			BEARER_TOKEN_AUTH_ENABLED,
			DB_CLIENT,
			DB_CONNECTION_STRING,
			DB_DOCUMENT_REGISTER_TABLE,
			DB_PATIENT_PREFERENCES_TABLE,
			DB_PATIENT_PREFERENCES_TYPE_TABLE,
			DB_PATIENT_PREFERENCES_VALUE_TABLE,
			DB_READ_RECEIPT_DOCS_TABLE,
		});

		const config = await getConfig();

		expect(config.fastify).toEqual({
			host: SERVICE_HOST,
			port: SERVICE_PORT,
		});

		expect(config.fastifyInit.logger).toEqual({
			formatters: { level: expect.any(Function) },
			level: "info",
			prettyPrint: false,
			redact: ["req.headers.authorization"],
			serializers: {
				req: expect.any(Function),
				res: expect.any(Function),
			},
			timestamp: expect.any(Function),
			stream: expect.any(Object),
		});
		expect(config.fastifyInit.logger.formatters.level()).toEqual({
			level: undefined,
		});
		expect(config.fastifyInit.logger.timestamp().substring(0, 7)).toBe(
			',"time"'
		);

		expect(config.fastifyInit.https).toBeUndefined();
		expect(config.fastifyInit.http2).toBeUndefined();

		expect(config.cors).toEqual({
			origin: false,
			hideOptionsRoute: true,
		});

		expect(config.processLoad).toEqual({
			maxEventLoopDelay: 0,
			maxEventLoopUtilization: 0,
			maxHeapUsedBytes: 0,
			maxRssBytes: 0,
		});

		expect(config.rateLimit).toEqual({
			allowList: JSON.parse(RATE_LIMIT_EXCLUDED_ARRAY),
			continueExceeding: true,
			max: 1000,
			timeWindow: 60000,
		});

		expect(config.admin).toEqual({
			username: ADMIN_USERNAME,
			password: ADMIN_PASSWORD,
		});

		expect(config.bearerTokenAuthEnabled).toBe(false);

		expect(config.database).toEqual({
			client: "mssql",
			connection: DB_CONNECTION_STRING,
			tables: {
				documentRegister: DB_DOCUMENT_REGISTER_TABLE,
				patientPref: DB_PATIENT_PREFERENCES_TABLE,
				patientPrefTypeLookup: DB_PATIENT_PREFERENCES_TYPE_TABLE,
				patientPrefValueLookup: DB_PATIENT_PREFERENCES_VALUE_TABLE,
				readReceipt: DB_READ_RECEIPT_DOCS_TABLE,
			},
		});
	});

	test("Should return values according to environment variables - HTTPS (SSL cert) enabled and HTTP2 enabled", async () => {
		const NODE_ENV = "development";
		const SERVICE_HOST = faker.internet.ip();
		const SERVICE_PORT = faker.datatype.number();
		const HTTPS_SSL_CERT_PATH =
			"./test_resources/test_ssl_cert/server.cert";
		const HTTPS_SSL_KEY_PATH = "./test_resources/test_ssl_cert/server.key";
		const HTTPS_HTTP2_ENABLED = true;
		const LOG_LEVEL = faker.random.arrayElement([
			"debug",
			"warn",
			"silent",
		]);
		const LOG_ROTATION_DATE_FORMAT = "YYYY-MM";
		const LOG_ROTATION_FILENAME = "./test_resources/test-log-%DATE%.log";
		const LOG_ROTATION_FREQUENCY = "custom";
		const PROC_LOAD_MAX_EVENT_LOOP_DELAY = 1000;
		const PROC_LOAD_MAX_EVENT_LOOP_UTILIZATION = 0.98;
		const PROC_LOAD_MAX_HEAP_USED_BYTES = 100000000;
		const PROC_LOAD_MAX_RSS_BYTES = 100000000;
		const RATE_LIMIT_MAX_CONNECTIONS_PER_MIN = 2000;
		const RATE_LIMIT_EXCLUDED_ARRAY = '["127.0.0.1"]';
		const ADMIN_USERNAME = "admin";
		const ADMIN_PASSWORD = "password";
		const BEARER_TOKEN_AUTH_ENABLED = true;
		const DB_CLIENT = "mssql";
		const DB_CONNECTION_STRING =
			"Server=localhost,1433;Database=database;User Id=username;Password=password;Encrypt=true";
		const DB_DOCUMENT_REGISTER_TABLE = "YDHAPPDOC.dbo.SPINDEX";
		const DB_PATIENT_PREFERENCES_TABLE = "patient.preferences";
		const DB_PATIENT_PREFERENCES_TYPE_TABLE = "lookup.preferenceType";
		const DB_PATIENT_PREFERENCES_VALUE_TABLE = "lookup.preferenceValue";
		const DB_READ_RECEIPT_DOCS_TABLE = "receipt.documents";

		Object.assign(process.env, {
			NODE_ENV,
			SERVICE_HOST,
			SERVICE_PORT,
			HTTPS_SSL_CERT_PATH,
			HTTPS_SSL_KEY_PATH,
			HTTPS_HTTP2_ENABLED,
			LOG_LEVEL,
			LOG_ROTATION_DATE_FORMAT,
			LOG_ROTATION_FILENAME,
			LOG_ROTATION_FREQUENCY,
			PROC_LOAD_MAX_EVENT_LOOP_DELAY,
			PROC_LOAD_MAX_EVENT_LOOP_UTILIZATION,
			PROC_LOAD_MAX_HEAP_USED_BYTES,
			PROC_LOAD_MAX_RSS_BYTES,
			RATE_LIMIT_MAX_CONNECTIONS_PER_MIN,
			RATE_LIMIT_EXCLUDED_ARRAY,
			ADMIN_USERNAME,
			ADMIN_PASSWORD,
			BEARER_TOKEN_AUTH_ENABLED,
			DB_CLIENT,
			DB_CONNECTION_STRING,
			DB_DOCUMENT_REGISTER_TABLE,
			DB_PATIENT_PREFERENCES_TABLE,
			DB_PATIENT_PREFERENCES_TYPE_TABLE,
			DB_PATIENT_PREFERENCES_VALUE_TABLE,
			DB_READ_RECEIPT_DOCS_TABLE,
		});

		const config = await getConfig();

		expect(config.fastify).toEqual({
			host: SERVICE_HOST,
			port: SERVICE_PORT,
		});

		expect(config.fastifyInit.logger).toEqual({
			formatters: { level: expect.any(Function) },
			level: LOG_LEVEL,
			prettyPrint: false,
			redact: ["req.headers.authorization"],
			serializers: {
				req: expect.any(Function),
				res: expect.any(Function),
			},
			timestamp: expect.any(Function),
			stream: expect.any(Object),
		});
		expect(config.fastifyInit.logger.formatters.level()).toEqual({
			level: undefined,
		});
		expect(config.fastifyInit.logger.timestamp().substring(0, 7)).toBe(
			',"time"'
		);

		expect(config.fastifyInit.https).toEqual({
			allowHTTP1: true,
			cert: expect.any(Buffer),
			key: expect.any(Buffer),
		});
		expect(config.fastifyInit.http2).toBe(true);

		expect(config.processLoad).toEqual({
			maxEventLoopDelay: PROC_LOAD_MAX_EVENT_LOOP_DELAY,
			maxEventLoopUtilization: PROC_LOAD_MAX_EVENT_LOOP_UTILIZATION,
			maxHeapUsedBytes: PROC_LOAD_MAX_HEAP_USED_BYTES,
			maxRssBytes: PROC_LOAD_MAX_RSS_BYTES,
		});

		expect(config.rateLimit).toEqual({
			allowList: JSON.parse(RATE_LIMIT_EXCLUDED_ARRAY),
			continueExceeding: true,
			max: RATE_LIMIT_MAX_CONNECTIONS_PER_MIN,
			timeWindow: 60000,
		});

		expect(config.admin).toEqual({
			username: ADMIN_USERNAME,
			password: ADMIN_PASSWORD,
		});

		expect(config.bearerTokenAuthEnabled).toBe(true);

		expect(config.database).toEqual({
			client: DB_CLIENT,
			connection: DB_CONNECTION_STRING,
			tables: {
				documentRegister: DB_DOCUMENT_REGISTER_TABLE,
				patientPref: DB_PATIENT_PREFERENCES_TABLE,
				patientPrefTypeLookup: DB_PATIENT_PREFERENCES_TYPE_TABLE,
				patientPrefValueLookup: DB_PATIENT_PREFERENCES_VALUE_TABLE,
				readReceipt: DB_READ_RECEIPT_DOCS_TABLE,
			},
		});
	});

	test("Should return values according to environment variables - HTTPS (PFX cert) enabled and HTTP2 enabled", async () => {
		const SERVICE_HOST = faker.internet.ip();
		const SERVICE_PORT = faker.datatype.number();
		const HTTPS_PFX_FILE_PATH =
			"./test_resources/test_ssl_cert/server.cert"; // Not an actual PFX file
		const HTTPS_PFX_PASSPHRASE = faker.lorem.word();
		const HTTPS_HTTP2_ENABLED = true;
		const LOG_LEVEL = faker.random.arrayElement([
			"debug",
			"warn",
			"silent",
		]);
		const ADMIN_USERNAME = "admin";
		const ADMIN_PASSWORD = "password";

		Object.assign(process.env, {
			SERVICE_HOST,
			SERVICE_PORT,
			HTTPS_PFX_FILE_PATH,
			HTTPS_PFX_PASSPHRASE,
			HTTPS_HTTP2_ENABLED,
			LOG_LEVEL,
			ADMIN_USERNAME,
			ADMIN_PASSWORD,
		});

		const config = await getConfig();

		expect(config.fastify).toEqual({
			host: SERVICE_HOST,
			port: SERVICE_PORT,
		});

		expect(config.fastifyInit.https).toEqual({
			allowHTTP1: true,
			passphrase: HTTPS_PFX_PASSPHRASE,
			pfx: expect.any(Buffer),
		});
		expect(config.fastifyInit.http2).toBe(true);

		expect(config.admin).toEqual({
			username: ADMIN_USERNAME,
			password: ADMIN_PASSWORD,
		});
	});

	// CORS env variables
	test.each([
		{
			testName: "CORS origin set to true and credentials enabled",
			envVariables: {
				CORS_ORIGIN: true,
				CORS_ALLOW_CREDENTIALS: true,
			},
			expected: {
				origin: true,
				credentials: true,
			},
		},
		{
			testName: "CORS origin set to false",
			envVariables: {
				CORS_ORIGIN: false,
			},
			expected: {
				origin: false,
			},
		},
		{
			testName: "CORS origin set to comma-delimited string value",
			envVariables: {
				CORS_ORIGIN:
					"https://test1.ydh.nhs.uk, https://test2.ydh.nhs.uk",
			},
			expected: {
				origin: expect.arrayContaining([
					"https://test1.ydh.nhs.uk",
					"https://test2.ydh.nhs.uk",
				]),
			},
		},
		{
			testName: "CORS origin set to string value",
			envVariables: {
				CORS_ORIGIN: "https://ydh.nhs.uk",
			},
			expected: {
				origin: "https://ydh.nhs.uk",
			},
		},
	])(
		"Should return values according to environment variables - $testName",
		async ({ envVariables, expected }) => {
			const SERVICE_HOST = faker.internet.ip();
			const SERVICE_PORT = faker.datatype.number();
			const CORS_ORIGIN = envVariables.CORS_ORIGIN;
			const CORS_ALLOWED_HEADERS =
				"Accept, Authorization, Content-Type, Origin, X-Requested-With";
			const CORS_ALLOW_CREDENTIALS =
				envVariables?.CORS_ALLOW_CREDENTIALS || "";
			const CORS_EXPOSED_HEADERS = "Location";
			const CORS_MAX_AGE = 10;
			const LOG_LEVEL = faker.random.arrayElement([
				"debug",
				"warn",
				"silent",
			]);
			const ADMIN_USERNAME = "admin";
			const ADMIN_PASSWORD = "password";

			Object.assign(process.env, {
				SERVICE_HOST,
				SERVICE_PORT,
				CORS_ORIGIN,
				CORS_ALLOWED_HEADERS,
				CORS_ALLOW_CREDENTIALS,
				CORS_EXPOSED_HEADERS,
				CORS_MAX_AGE,
				LOG_LEVEL,
				ADMIN_USERNAME,
				ADMIN_PASSWORD,
			});

			const config = await getConfig();

			expect(config.fastify).toEqual({
				host: SERVICE_HOST,
				port: SERVICE_PORT,
			});

			expect(config.cors).toEqual({
				origin: expected.origin,
				allowedHeaders: CORS_ALLOWED_HEADERS,
				credentials: expected?.credentials,
				exposedHeaders: CORS_EXPOSED_HEADERS,
				hideOptionsRoute: true,
				maxAge: CORS_MAX_AGE,
			});
		}
	);

	// HTTPS cert path env variables
	test.each([
		{
			testName: "invalid PFX file path",
			envVariables: {
				HTTPS_PFX_FILE_PATH: "./test_resources/test_ssl_cert/error.pfx",
				HTTPS_PFX_PASSPHRASE: faker.lorem.word(),
			},
		},
		{
			testName: "invalid SSL cert file path",
			envVariables: {
				HTTPS_SSL_CERT_PATH:
					"./test_resources/test_ssl_cert/error.cert",
				HTTPS_SSL_KEY_PATH: "./test_resources/test_ssl_cert/error.key",
			},
		},
	])("Should throw error if $testName", async ({ envVariables }) => {
		const SERVICE_HOST = faker.internet.ip();
		const SERVICE_PORT = faker.datatype.number();
		const HTTPS_SSL_KEY_PATH = envVariables?.HTTPS_SSL_KEY_PATH || "";
		const HTTPS_SSL_CERT_PATH = envVariables?.HTTPS_SSL_CERT_PATH || "";
		const HTTPS_PFX_FILE_PATH = envVariables?.HTTPS_PFX_FILE_PATH || "";
		const HTTPS_PFX_PASSPHRASE = envVariables?.HTTPS_PFX_PASSPHRASE || "";
		const LOG_LEVEL = faker.random.arrayElement([
			"debug",
			"warn",
			"silent",
		]);
		const ADMIN_USERNAME = "admin";
		const ADMIN_PASSWORD = "password";

		Object.assign(process.env, {
			SERVICE_HOST,
			SERVICE_PORT,
			HTTPS_SSL_CERT_PATH,
			HTTPS_SSL_KEY_PATH,
			HTTPS_PFX_FILE_PATH,
			HTTPS_PFX_PASSPHRASE,
			LOG_LEVEL,
			ADMIN_USERNAME,
			ADMIN_PASSWORD,
		});

		await expect(getConfig()).rejects.toThrow();
	});
});
