import { Pool, ConnectionConfig } from 'pg';
import { PostgresqlDatabaseSchema } from '../../../types/database.types';

export async function getPostgresqlClient(connectionData: PostgresqlDatabaseSchema) {
	const { username, host, port, ssl, CA, clientCert, clientKey, dbName, password, connectionString } = connectionData;

	const sslObject: { ssl?: ConnectionConfig['ssl'] } = {};
	if (ssl) {
		sslObject.ssl = { rejectUnauthorized: false };
		if (CA) sslObject.ssl.ca = CA;
		if (clientCert) sslObject.ssl.cert = clientCert;
		if (clientKey) sslObject.ssl.key = clientKey;
	}

	return connectionString
		? new Pool({
				connectionString: connectionString
					.replace(/&sslmode(=[^&]*)?|sslmode(=[^&]*)?&?/i, '')
					.replace(/&ssl(=[^&]*)?|ssl(=[^&]*)?&?/i, ''),
				...sslObject,
		  })
		: new Pool({
				host,
				user: username,
				database: dbName,
				password,
				port: parseInt(port, 10),
				...sslObject,
		  });
}
