import { Document } from 'mongodb';

export type MongoActions = {
	findOne: {
		id: string;
		collection: string;
		filter?: Document;
		project?: Document;
		sort?: Document;
		skip?: number;
	};
	find: {
		id: string;
		collection: string;
		filter?: Document;
		project?: Document;
		sort?: Document;
		limit?: number;
		skip?: number;
	};
	deleteOne: {
		id: string;
		collection: string;
		filter?: Document;
	};
	deleteMany: {
		id: string;
		collection: string;
		filter?: Document;
	};
	insertOne: {
		id: string;
		collection: string;
		document: Document;
	};
	insertMany: {
		id: string;
		collection: string;
		documents: Document[];
	};
	aggregate: {
		id: string;
		collection: string;
		pipeline: Document[];
	};
	updateOne: {
		id: string;
		collection: string;
		filter?: Document;
		update: Document;
	};
	updateMany: {
		id: string;
		collection: string;
		filter?: Document;
		update: Document;
	};
};
