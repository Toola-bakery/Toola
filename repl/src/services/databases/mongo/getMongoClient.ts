import { MongoClient } from 'mongodb';
import { MongoDatabaseSchema } from '../../../types/database.types';

export async function getMongoClient(mongoProps: MongoDatabaseSchema) {
	const { host, connectionString, clientKeyAndCert, CA, connectionFormat, port, dbName, ssl, username, password } =
		mongoProps;

	const url =
		connectionString || connectionFormat === 'dns' //
			? `mongodb+srv://${host}`
			: `mongodb://${host}:${port}`;

	const mongoConnection = await MongoClient.connect(url, {
		auth: { username, password },
		ssl: !!ssl,
		ca: CA,
	});

	const db = mongoConnection.db(dbName);
	return [mongoConnection, db] as const;
}
