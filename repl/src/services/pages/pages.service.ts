import { Context, ServiceSchema } from 'moleculer';
import { mongoDB } from '../../utils/mongo';

type PageSchema = {
	value: any;
	pageId: string;
};

const pagesCollection = mongoDB.collection<PageSchema>('pages');

export const PagesService: ServiceSchema = {
	name: 'pages',
	settings: {},
	actions: {
		get: {
			params: {
				pageId: { type: 'string' },
			},
			async handler(ctx: Context<{ pageId: string }>) {
				const { pageId } = ctx.params;
				const resp = await pagesCollection.findOne({ pageId });
				if (!resp || !resp.value || !resp.value[pageId])
					return {
						value: {
							[pageId]: { id: pageId, type: 'page', blocks: [], parentId: null, pageId },
						},
					};
				return resp;
			},
		},
		post: {
			params: {
				pageId: { type: 'string' },
				value: { type: 'object' },
			},
			async handler(ctx: Context<{ pageId: string; value: any }>) {
				const { pageId, value } = ctx.params;
				return pagesCollection.updateOne({ pageId }, { $set: { value } }, { upsert: true });
			},
		},
		topLevelPages: {
			params: {},
			async handler(ctx) {
				const resp = await pagesCollection
					.aggregate<{ names: string[] }>([
						{
							$group: { _id: null, names: { $addToSet: '$pageId' } },
						},
					])
					.toArray();
				return resp[0].names;
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

export default PagesService;
