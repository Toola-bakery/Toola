import { Context, ServiceSchema } from 'moleculer';
import { v4, version } from 'uuid';
import { mongoDB } from '../../utils/mongo';

type DatabaseSchema = {
	_id: string;
	type: 'mongodb';
	name: string;
	host: string;
	connectionFormat: 'dns' | 'standard';
	dbName: string;
	username: string;
	password: string;
	ssl: boolean;
	CA?: string;
	clientKeyAndCert?: string;
};

const databaseCollection = mongoDB.collection<DatabaseSchema>('databases');

export const DatabasesService: ServiceSchema = {
	name: 'databases',
	settings: {},
	actions: {
		post: {
			params: {
				pageId: { type: 'string' },
				value: { type: 'object' },
			},
			async handler(ctx: Context<DatabaseSchema>) {
				const database = ctx.params;

				if (database._id && version(database._id) !== 4) throw new Error('bad _id');

				const newId = database._id || v4();

				await databaseCollection.updateOne(
					{ _id: newId },
					{ $setOnInsert: { _id: newId }, $set: database },
					{ upsert: true },
				);

				return { ok: true };
			},
		},
		getAll: {
			params: {},
			async handler(ctx) {
				return databaseCollection.find().toArray();
			},
		},
	},
	methods: {},
	async started() {
		this.working = true;
	},
	async stopped() {
		this.working = false;
	},
};

export default DatabasesService;
