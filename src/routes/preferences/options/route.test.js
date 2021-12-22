const Fastify = require("fastify");
const sensible = require("fastify-sensible");
const route = require(".");
const getConfig = require("../../../config");
const cleanObject = require("../../../plugins/clean-object");
const sharedSchemas = require("../../../plugins/shared-schemas");

const expResPayload = {
	preferences: [
		{
			type: {
				display: "SMS",
				id: 1,
				priority: 0,
				selected: 2,
				options: [
					{
						display: "yes",
						value: 1,
					},
					{
						display: "no",
						value: 2,
					},
				],
			},
		},
	],
};

describe("Options Route", () => {
	const connectionTests = [
		{
			testName: "MSSQL Connection",
			envVariables: {
				DB_CLIENT: "mssql",
			},
			mocks: {
				queryResults: {
					error: {
						recordsets: [[], []],
					},
					ok: {
						recordsets: [
							[
								{
									preferenceTypeId: 1,
									preferenceTypeDisplay: "SMS",
								},
							],
							[
								{
									preferenceTypeId: 1,
									preferenceTypeDisplay: "SMS",
									preferenceOptionDisplay: "yes",
									preferenceOptionValue: 1,
								},
								{
									preferenceTypeId: 1,
									preferenceTypeDisplay: "SMS",
									preferenceOptionDisplay: "no",
									preferenceOptionValue: 2,
								},
							],
						],
					},
				},
			},
		},
		{
			testName: "PostgreSQL Connection",
			envVariables: {
				DB_CLIENT: "postgresql",
			},
			mocks: {
				queryResults: {
					error: [{}, {}],
					ok: [
						{
							rows: [
								{
									preferenceTypeId: 1,
									preferenceTypeDisplay: "SMS",
								},
							],
						},
						{
							rows: [
								{
									preferenceTypeId: 1,
									preferenceTypeDisplay: "SMS",
									preferenceOptionDisplay: "yes",
									preferenceOptionValue: 1,
								},
								{
									preferenceTypeId: 1,
									preferenceTypeDisplay: "SMS",
									preferenceOptionDisplay: "no",
									preferenceOptionValue: 2,
								},
							],
						},
					],
				},
			},
		},
	];
	connectionTests.forEach((testObject) => {
		describe(`${testObject.testName}`, () => {
			let config;
			let server;

			beforeAll(async () => {
				Object.assign(process.env, testObject.envVariables);
				config = await getConfig();

				server = Fastify();
				server
					.register(cleanObject)
					.register(sensible)
					.register(sharedSchemas)
					.register(route, config);

				await server.ready();
			});

			afterAll(async () => {
				await server.close();
			});

			describe("GET Requests", () => {
				test("Should return preference options", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(testObject.mocks.queryResults.ok);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "GET",
						url: "/",
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual(expResPayload);
					expect(response.statusCode).toBe(200);
				});

				test("Should return HTTP status code 404 if no values returned from database", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(testObject.mocks.queryResults.error);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "GET",
						url: "/",
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Not Found",
						message: "Invalid or expired search results",
						statusCode: 404,
					});
					expect(response.statusCode).toBe(404);
				});

				test("Should return HTTP status code 500 if connection issue encountered", async () => {
					const mockQueryFn = jest
						.fn()
						.mockRejectedValue(Error("Failed to connect to DB"));

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "GET",
						url: "/",
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message: "Unable to return result(s) from database",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});
			});
		});
	});
});
