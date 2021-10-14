import Moleculer, { ServiceSchema } from 'moleculer';
import { ObjectId } from 'mongodb';
import { v4 } from 'uuid';
import { DatabaseSchema } from '../../types/database.types';
import { AuthMeta } from '../../types/users.types';
import { mongoDB } from '../../utils/mongo';
import { allValidators } from './allValidators';
import ValidationError = Moleculer.Errors.ValidationError;

const databaseCollection = mongoDB.collection<DatabaseSchema>('databases');

function convertActionsToArray(actions: any) {
	return Object.keys(actions).map(name => ({
		name,
		fields: Object.keys(actions[name]).map(id => ({ id, ...actions[name][id] })),
	}));
}

function evalValidation(type: DatabaseSchema['type'], database: DatabaseSchema) {
	if (!(database.type in allValidators)) throw new Error();
	const results = allValidators[database.type].map(check => {
		try {
			const result = check({ ...database }); // To fix strict remove bug
			if (result !== true) return result;
			return check(database);
		} catch (e) {
			return e;
		}
	});
	if (results.includes(true)) return true;
	throw new ValidationError('Database validation error', '402', { results });
}
export const DatabasesService: ServiceSchema<
	'databases',
	{
		post: {
			database: DatabaseSchema;
			projectId: ObjectId;
			meta: AuthMeta;
		};
		get: {
			id: string;
			meta: AuthMeta;
		};
		getAll: {
			projectId: ObjectId;
			meta: AuthMeta;
		};
	}
> = {
	name: 'databases',
	settings: {},
	actions: {
		post: {
			params: {
				projectId: { type: 'objectID', ObjectID: ObjectId, convert: true },
				database: { type: 'object', props: { type: 'string' } },
			},
			async handler(ctx) {
				const { database: databaseOriginal, projectId } = ctx.params;
				const { userId, projectId: authProjectId } = ctx.meta;
				console.log({ userId });

				if (userId) {
					const { hasAccess } = await ctx.call('projects.hasAccess', { projectId, userId });
					console.log({ hasAccess });
					if (!hasAccess) throw new Error('No access to project');
				} else throw new Error('No access to project');

				const database = { ...databaseOriginal };
				evalValidation(database.type, database);

				const newId = database._id || v4();

				await databaseCollection.updateOne(
					{ _id: newId, projectId },
					{ $setOnInsert: { _id: newId, projectId }, $set: database },
					{ upsert: true },
				);

				return { ok: true };
			},
		},
		get: {
			params: {
				id: { type: 'uuid', version: 4 },
			},
			async handler(ctx) {
				const { id } = ctx.params;
				const { userId, projectId: authProjectId } = ctx.meta;

				const item = await databaseCollection.findOne({ _id: id });

				if (userId) {
					const { hasAccess } = await ctx.call('projects.hasAccess', { projectId: item.projectId, userId });
					if (!hasAccess) throw new Error('No access to project');
				} else if (authProjectId.toString() !== item.projectId.toString()) {
					throw new Error('No access to project');
				}

				return item;
			},
		},
		getAll: {
			params: {
				projectId: { type: 'objectID', ObjectID: ObjectId, convert: true },
			},
			async handler(ctx) {
				const { projectId } = ctx.params;
				const { userId, projectId: authProjectId } = ctx.meta;
				if (userId) {
					const { hasAccess } = await ctx.call('projects.hasAccess', { projectId, userId });
					if (!hasAccess) throw new Error('No access to project');
				} else if (authProjectId.toString() !== projectId.toString()) {
					throw new Error('No access to project');
				}

				const databases = await databaseCollection.find({ projectId }).toArray();

				const result = await ctx.mcall(
					databases.map(db => ({
						action: `${db.type}Manager.queryBuilder`,
						params: { id: db._id, database: db },
					})),
				);
				return databases.map((db, index) => ({ ...db, actions: convertActionsToArray(result[index]) }));
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
