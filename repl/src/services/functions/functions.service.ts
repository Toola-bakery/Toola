import { ServiceSchema } from 'moleculer';
import { ObjectId } from 'mongodb';
import AWS from 'aws-sdk';
import { crossenvExecuteFunction } from './crossenvExecuteFunction';

export const FunctionsService: ServiceSchema<
	'functions',
	{
		run: {
			code: string;
			callArgs?: unknown[];
			reqId: string;
			meta: { wsId: string; userId: string | ObjectId; projectId: string | ObjectId };
			preloadState: { [key: string]: unknown };
		};
	}
> = {
	name: 'functions',
	settings: {},
	actions: {
		run: {
			visibility: 'public',
			params: {
				code: { type: 'string' },
				callArgs: { type: 'array', optional: true },
				reqId: { type: 'string', optional: true },
				preloadState: { type: 'object', optional: true, default: {} },
			},
			async handler(ctx) {
				const { reqId } = ctx.params;
				const { wsId, projectId } = ctx.meta;

				if (!wsId) throw new Error('Set websocket id');

				const { token } = await ctx.call('auth.createCustomToken', { data: { projectId } });

				await ctx.broadcast('ws.send', { message: { action: 'function.start', id: reqId }, id: wsId });
				crossenvExecuteFunction(ctx, token);
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
} as const;

export default FunctionsService;
