import { ObjectId } from 'mongodb';

export type DatabaseSchema = { _id: string; projectId: ObjectId } & MongoDatabaseSchema;
export type MongoDatabaseSchema = {
	type: 'mongo';
	name: string;
	host: string;
	port?: string;
	connectionFormat: 'dns' | 'standard';
	dbName: string;
	username: string;
	password: string;
	ssl: boolean;
	CA?: string;
	clientKeyAndCert?: string;
	cache?: {
		collections?: string[];
	};
};
