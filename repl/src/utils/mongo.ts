import { MongoClient, MongoClientOptions, Db } from 'mongodb';
import * as path from 'path';

// eslint-disable-next-line import/no-mutable-exports
export let mongoDB: Db;

export const mongoRef: {
	db?: Db;
	connectionPromise?: Promise<{ client: MongoClient; databaseName: string }>;
} = {};

export async function mongoConnect() {
	if (mongoRef.connectionPromise) return mongoRef.connectionPromise;

	const options: MongoClientOptions = {
		sslCA: path.resolve(__dirname, '../../ca-certificate.crt'),
	};

	mongoRef.connectionPromise = MongoClient.connect(process.env.DB_LINK, options).then(client => {
		mongoRef.db = client.db(process.env.DB_NAME);
		mongoDB = mongoRef.db;
		return { client, databaseName: process.env.DB_NAME };
	});

	return mongoRef.connectionPromise;
}

export async function getMongo() {
	await mongoConnect();
	return mongoRef.db;
}
