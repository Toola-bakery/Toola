import { MongoClient } from 'mongodb';
import { MongoDatabaseSchema } from '../../../types/database.types';

export async function getMongoClient(mongoProps: MongoDatabaseSchema) {
	const { host, clientKeyAndCert, CA, connectionFormat, port, dbName, ssl, username, password } = mongoProps;

	const url = `${connectionFormat === 'dns' ? 'mongodb+srv' : 'mongodb'}://${host}${
		connectionFormat !== 'dns' ? `:${port}` : ''
	}`;
	const mongoConnection = await MongoClient.connect(url, {
		auth: { username, password },
		ssl: !!ssl,
		ca: CA,
	});

	const db = mongoConnection.db(dbName);
	return [mongoConnection, db] as const;
}
