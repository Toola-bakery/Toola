import { ObjectId } from 'mongodb';

export type DatabaseSchema = { _id: string; projectId: ObjectId } & DatabasesConnectionsProps;

export type DatabasesConnectionsProps = MongoDatabaseSchema | PostgresqlDatabaseSchema;

export type MongoDatabaseSchema = {
	type: 'mongo';
	connectionString?: string;
	name?: string;
	host?: string;
	port?: string;
	connectionFormat?: 'dns' | 'standard';
	dbName?: string;
	username?: string;
	password?: string;
	ssl?: boolean;
	CA?: string;
	clientKeyAndCert?: string;
};

export type PostgresqlDatabaseSchema = {
	type: 'postgresql';
	connectionString?: string;
	name?: string;
	host?: string;
	port?: string;
	dbName?: string;
	username?: string;
	password?: string;
	ssl?: boolean;
	CA?: string;
	clientKey?: string;
	clientCert?: string;
};
