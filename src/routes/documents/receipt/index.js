// Import plugins
const cors = require("@fastify/cors");

const { receiptDeleteSchema, receiptPutSchema } = require("./schema");
const { receiptDelete, receiptInsert } = require("./query");

/**
 * @author Frazer Smith
 * @description Sets routing options for server.
 * @param {object} server - Fastify instance.
 * @param {object} options - Route config values.
 * @param {boolean=} options.bearerTokenAuthEnabled - Apply `bearerToken` security scheme to route if defined.
 * @param {object} options.cors - CORS settings.
 * @param {object} options.database - Database config values.
 * @param {('mssql'|'postgresql')} options.database.client - Database client.
 * @param {object} options.database.tables - Database tables.
 * @param {string} options.database.tables.readReceipt - Name and schema of document read receipt table.
 */
async function route(server, options) {
	if (options.bearerTokenAuthEnabled) {
		const security = [{ bearerToken: [] }];
		const unauthRef = {
			$ref: "responses#/properties/unauthorized",
			description: "Unauthorized",
		};

		receiptDeleteSchema.security = security;
		receiptDeleteSchema.response[401] = unauthRef;

		receiptPutSchema.security = security;
		receiptPutSchema.response[401] = unauthRef;
	}

	// Register plugins
	await server
		// Enable CORS if options passed
		.register(cors, {
			...options.cors,
			methods: ["DELETE", "PUT"],
		});

	server.route({
		method: "DELETE",
		url: "/:id",
		schema: receiptDeleteSchema,
		preValidation: async (req) => {
			if (
				options.bearerTokenAuthEnabled &&
				!req.scopes?.includes("documents/receipt.delete")
			) {
				throw server.httpErrors.unauthorized(
					"You do not have permission to perform an HTTP DELETE request on this route"
				);
			}
		},
		handler: async (req, res) => {
			try {
				const results = await server.db.query(
					receiptDelete({
						id: req.params.id,
						patientId: req.query.patientId,
						readReceiptTable: options.database.tables.readReceipt,
					})
				);

				/**
				 * Database client packages return results in different structures,
				 * (mssql uses rowsAffected, pg uses rowCount) thus the optional chaining
				 */
				if (results.rowsAffected?.[0] > 0 || results.rowCount > 0) {
					return res.status(204).send();
				}
				return res.notFound(
					"Record does not exist or has already been deleted"
				);
			} catch (err) {
				return res.internalServerError(err);
			}
		},
	});

	server.route({
		method: "PUT",
		url: "/:id",
		schema: receiptPutSchema,
		preValidation: async (req) => {
			if (
				options.bearerTokenAuthEnabled &&
				!req.scopes?.includes("documents/receipt.put")
			) {
				throw server.httpErrors.unauthorized(
					"You do not have permission to perform an HTTP PUT request on this route"
				);
			}
		},
		handler: async (req, res) => {
			try {
				const rows = await server.db.query(
					receiptInsert({
						dbClient: options.database.client,
						id: req.params.id,
						patientId: req.query.patientId,
						timestamp: req.query.timestamp,
						readReceiptTable: options.database.tables.readReceipt,
					})
				);

				/**
				 * Database client packages return results in different structures,
				 * (mssql uses rowsAffected, pg uses rowCount) thus the optional chaining
				 */
				if (rows.rowsAffected?.[0] > 0 || rows.rowCount > 0) {
					return res.status(204).send();
				}
				throw new Error("No rows were inserted");
			} catch (err) {
				return res.internalServerError(err);
			}
		},
	});
}

module.exports = route;
