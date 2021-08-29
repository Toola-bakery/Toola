export type DatabaseSchema = MongoDatabaseSchema;
export type MongoDatabaseSchema = {
	_id: string;
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
