import { MongoClient, MongoClientOptions, Db } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

export const mongoRef: {
	db?: Db;
	connectionPromise?: Promise<MongoClient>;
} = {};

export async function mongoConnect() {
	if (mongoRef.connectionPromise) return mongoRef.connectionPromise;

	const options: MongoClientOptions = {
		sslCA: path.resolve(__dirname, '../../ca-certificate.crt'),
	};

	mongoRef.connectionPromise = MongoClient.connect(process.env.DB_LINK, options).then(c => {
		mongoRef.db = c.db(process.env.DB_NAME);
		return c;
	});

	return mongoRef.connectionPromise;
}

export async function getMongo() {
	await mongoConnect();
	return mongoRef.db;
}
getMongo();
