import { ServiceSchema } from 'moleculer';
import { ObjectId } from 'mongodb';
import { v4 } from 'uuid';
import { AuthMeta } from '../../types/users.types';
import { mongoDB } from '../../utils/mongo';

type PageSchema = {
	_id: string;
	projectId: ObjectId;
	value: any;
};

const pagesCollection = mongoDB.collection<PageSchema>('pages');

export const PagesService: ServiceSchema<
	'pages',
	{
		create: { id: string; parentPageId: string | null; title: string; projectId: ObjectId; meta: AuthMeta };
		get: { id: string; meta: AuthMeta };
		post: { id: string; title?: string; value: any; meta: AuthMeta };
		topLevelPages: { projectId: ObjectId; meta: AuthMeta };
	}
> = {
	name: 'pages',
	settings: {},
	actions: {
		create: {
			params: {
				id: { type: 'uuid', version: 4, optional: true },
				parentPageId: { type: 'uuid', version: 4, nullable: true, default: null, optional: true },
				title: { type: 'string', optional: true, default: 'Untitled' },
				projectId: { type: 'objectID', ObjectID: ObjectId, convert: true },
			},
			async handler(ctx) {
				const { id = v4(), parentPageId, title, projectId } = ctx.params;
				const { userId, projectId: authProjectId } = ctx.meta;

				if (userId) {
					const { hasAccess } = await ctx.call('projects.hasAccess', { projectId, userId });
					if (!hasAccess) throw new Error('No access to project');
				} else if (authProjectId.toString() !== projectId.toString()) {
					throw new Error('No access to project');
				}

				try {
					await pagesCollection.insertOne({
						_id: id,
						projectId,
						value: { page: { id: 'page', title, pageId: id, blocks: [], parentId: parentPageId, type: 'page' } },
					});
					return { ok: true };
				} catch (e) {
					if (e.message.includes('E11000')) return { ok: true };
					throw e;
				}
			},
		},
		get: {
			params: {
				id: { type: 'string' },
			},
			async handler(ctx) {
				const { id } = ctx.params;
				const { userId, projectId: authProjectId } = ctx.meta;

				const resp = await pagesCollection.findOne({ _id: id });

				if (!resp) throw new Error('Page does not exists');

				if (userId) {
					const { hasAccess } = await ctx.call('projects.hasAccess', { projectId: resp.projectId, userId });
					if (!hasAccess) throw new Error('No access to project');
				} else if (authProjectId.toString() !== resp.projectId.toString()) {
					throw new Error('No access to project');
				}

				if (!resp || !resp.value || !resp.value.page) throw new Error('Cant find page');
				return resp;
			},
		},
		post: {
			params: {
				id: { type: 'string' },
				value: { type: 'object', minProps: 1 },
			},
			async handler(ctx) {
				const { id, value } = ctx.params;
				const { userId, projectId: authProjectId } = ctx.meta;

				const resp = await pagesCollection.findOne({ _id: id }, { projection: { projectId: 1 } });

				if (userId) {
					const { hasAccess } = await ctx.call('projects.hasAccess', { projectId: resp.projectId, userId });
					if (!hasAccess) throw new Error('No access to project');
				} else if (authProjectId.toString() !== resp.projectId.toString()) {
					throw new Error('No access to project');
				}

				return pagesCollection.updateOne({ _id: id }, { $set: { value } });
			},
		},
		topLevelPages: {
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

				return pagesCollection
					.aggregate<{ pages: { title: string; id: string }[] }>([
						{ $match: { 'value.page.parentId': null, projectId } },
						{
							$group: {
								_id: null,
								pages: {
									$addToSet: { title: '$value.page.title', lowerTitle: { $toLower: '$value.page.title' }, id: '$_id' },
								},
							},
						},
						{ $unwind: '$pages' },
						{ $sort: { 'pages.lowerTitle': 1 } },
						{ $project: { _id: 0, title: '$pages.title', id: '$pages.id' } },
					])
					.toArray();
			},
		},
	},
};

export default PagesService;
