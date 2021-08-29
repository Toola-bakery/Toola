import { DatabaseSchema } from '../../../types/database.types';
import { MongoActions } from './actions.types';

type Actions = keyof MongoActions;
type Query = {
	[K in Actions]: { [A in Exclude<keyof MongoActions[K], 'id'>]: { type: string; label: string } };
};

export function mongoQueryBuilder(database?: DatabaseSchema): Query {
	return {
		find: {
			collection: { type: 'string', label: 'Collection' },
			filter: { type: 'object', label: 'Filter' },
			project: { type: 'object', label: 'Project' },
			sort: { type: 'object', label: 'Sort' },
			limit: { type: 'number', label: 'Limit' },
			skip: { type: 'number', label: 'Skip' },
		},
		aggregate: {
			collection: { type: 'string', label: 'Collection' },
			pipeline: { type: 'object', label: 'Pipeline' },
		},
		deleteMany: {
			collection: { type: 'string', label: 'Collection' },
			filter: { type: 'object', label: 'Pipeline' },
		},
		deleteOne: {
			collection: { type: 'string', label: 'Collection' },
			filter: { type: 'object', label: 'Filter' },
		},
		findOne: {
			collection: { type: 'string', label: 'Collection' },
			filter: { type: 'object', label: 'Filter' },
			project: { type: 'object', label: 'Project' },
			sort: { type: 'object', label: 'Sort' },
			skip: { type: 'number', label: 'Skip' },
		},
		insertMany: {
			collection: { type: 'string', label: 'Collection' },
			documents: { type: 'object', label: 'Document' },
		},
		insertOne: {
			collection: { type: 'string', label: 'Collection' },
			document: { type: 'object', label: 'Document' },
		},
		updateMany: {
			collection: { type: 'string', label: 'Collection' },
			filter: { type: 'object', label: 'Filter' },
			update: { type: 'object', label: 'Update' },
		},
		updateOne: {
			collection: { type: 'string', label: 'Collection' },
			filter: { type: 'object', label: 'Filter' },
			update: { type: 'object', label: 'Update' },
		},
	};
}
