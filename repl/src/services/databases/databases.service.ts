import { ServiceSchema } from 'moleculer';
import { ObjectId } from 'mongodb';
import { v4 } from 'uuid';
import { DatabaseSchema } from '../../types/database.types';
import { AuthMeta } from '../../types/users.types';
import { mongoDB } from '../../utils/mongo';

const databaseCollection = mongoDB.collection<DatabaseSchema>('databases');

function convertActionsToArray(actions: any) {
	return Object.keys(actions).map(name => ({
		name,
		fields: Object.keys(actions[name]).map(id => ({ id, ...actions[name][id] })),
	}));
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
				database: [
					{
						type: 'object',
						strict: 'remove',
						props: {
							_id: { type: 'uuid', version: 4, optional: true },
							type: { type: 'equal', value: 'mongodb' },
							name: { type: 'string', min: 5, max: 50 },
							host: { type: 'string', max: 200 },
							port: { type: 'string', max: 5, optional: true },
							connectionFormat: { type: 'enum', values: ['dns', 'standard'] },
							dbName: { type: 'string', max: 50 },
							username: { type: 'string', max: 50 },
							password: { type: 'string', max: 50 },
							ssl: { type: 'boolean', convert: true },
							CA: { type: 'string', optional: true },
							clientKeyAndCert: { type: 'string', optional: true },
						},
					},
				],
			},
			async handler(ctx) {
				const { database, projectId } = ctx.params;
				const { userId, projectId: authProjectId } = ctx.meta;

				if (userId) {
					const { hasAccess } = await ctx.call('projects.hasAccess', { projectId, userId });
					if (!hasAccess) throw new Error('No access to project');
				} else if (authProjectId.toString() !== projectId.toString()) {
					throw new Error('No access to project');
				}

				const newId = database._id || v4();

				await databaseCollection.updateOne(
					{ _id: newId, projectId },
					{ $setOnInsert: { _id: newId }, $set: { ...database, projectId } },
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
