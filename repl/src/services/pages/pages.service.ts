import { ServiceSchema } from 'moleculer';
import { v4 } from 'uuid';
import { mongoDB } from '../../utils/mongo';

type PageSchema = {
	_id: string;
	value: any;
};

const pagesCollection = mongoDB.collection<PageSchema>('pages');

export const PagesService: ServiceSchema<
	'pages',
	{
		create: { id: string; parentPageId: string | null; title: string };
		get: { id: string };
		post: { id: string; title?: string; value: any };
		topLevelPages: Record<string, never>;
	}
> = {
	name: 'pages',
	settings: {},
	actions: {
		create: {
			params: {
				id: { type: 'uuid', version: 4, optional: true },
				parentPageId: { type: 'uuid', version: 4, nullable: true },
				title: { type: 'string', optional: true, default: 'Untitled' },
			},
			async handler(ctx) {
				const { id = v4(), parentPageId, title } = ctx.params;
				try {
					await pagesCollection.insertOne({
						_id: id,
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
				const resp = await pagesCollection.findOne({ _id: id });
				if (!resp || !resp.value || !resp.value.page) throw new Error('Cant find page');
				return resp;
			},
		},
		post: {
			params: {
				id: { type: 'string' },
				value: { type: 'object' },
			},
			async handler(ctx) {
				const { id, value } = ctx.params;
				return pagesCollection.updateOne({ _id: id }, { $set: { value } });
			},
		},
		topLevelPages: {
			params: {},
			async handler(ctx) {
				const resp = await pagesCollection
					.aggregate<{ pages: { title: string; id: string }[] }>([
						{ $match: { 'value.page.parentId': null } },
						{ $group: { _id: null, pages: { $addToSet: { title: '$value.page.title', id: '$_id' } } } },
					])
					.toArray();
				return resp[0].pages;
			},
		},
	},
};

export default PagesService;
