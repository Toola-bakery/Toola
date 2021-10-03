import { ServiceSchema } from 'moleculer';
import { ObjectId } from 'mongodb';
import AWS from 'aws-sdk';

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
				const { code, callArgs, reqId, preloadState } = ctx.params;
				const { wsId, userId, projectId } = ctx.meta;

				if (!wsId) throw new Error('Set websocket id');

				const { token } = await ctx.call('auth.createCustomToken', { data: { projectId } });

				await ctx.broadcast('ws.send', { message: { action: 'function.start', id: reqId }, id: wsId });

				const lambda = new AWS.Lambda({
					apiVersion: '2015-03-31',
					credentials: {
						accessKeyId: process.env.AWS_ACCESS_KEY,
						secretAccessKey: process.env.AWS_SECRET_KEY,
					},
					region: 'eu-central-1',
				});

				const result = await lambda
					.invoke({
						FunctionName: 'arn:aws:lambda:eu-central-1:478939661155:function:serverless-workspace-dev-hello',
						Payload: JSON.stringify({
							token,
							reqId,
							code,
							wsId,
							projectId: projectId.toString(),
							callArgs: [],
							preloadState,
						}),
					})
					.promise();

				ctx.broadcast('ws.send', {
					id: wsId,
					message: { action: 'function.end', result: JSON.parse(result.Payload as string), id: reqId },
				});

				// executeFunction({
				// 	code,
				// 	output: data =>
				// 		ctx.broadcast('ws.send', {
				// 			id: wsId,
				// 			message: { action: 'function.output', id: reqId, data: data.toString('utf-8') },
				// 		}),
				// 	callArgs,
				// 	env: { wsId, token, projectId: projectId.toString(), reqId, preloadState: JSON.stringify(preloadState) },
				// })
				// 	.then(result =>
				// 		ctx.broadcast('ws.send', {
				// 			id: wsId,
				// 			message: { action: 'function.end', result, id: reqId },
				// 		}),
				// 	)
				// 	.catch(error =>
				// 		ctx.broadcast('ws.send', {
				// 			id: wsId,
				// 			message: { action: 'function.end', result: 'error', id: reqId },
				// 		}),
				// 	);
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
