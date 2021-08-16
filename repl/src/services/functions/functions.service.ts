import { ServiceSchema } from 'moleculer';
import { ActionsDeclarations } from '../services';
import { executeFunction } from './executeFunction';

export const FunctionsService: ServiceSchema<
	'functions',
	{
		run: {
			code: string;
			callArgs?: unknown[];
			reqId: string;
			meta: { wsId: string };
			preloadState: { [key: string]: unknown };
		};
	}
> = {
	name: 'functions',
	settings: {},
	actions: {
		run: {
			params: {
				code: { type: 'string' },
				callArgs: { type: 'array', optional: true },
				reqId: { type: 'string', optional: true },
				preloadState: { type: 'object', optional: true, default: {} },
			},
			async handler(ctx) {
				const { code, callArgs, reqId, preloadState } = ctx.params;
				const { wsId } = ctx.meta;
				if (!wsId) throw new Error('Set websocket id');

				this.broker.broadcast('ws.send', { message: { action: 'function.start', id: reqId }, id: wsId });

				executeFunction({
					code,
					output: data =>
						this.broker.broadcast('ws.send', {
							id: wsId,
							message: { action: 'function.output', id: reqId, data: data.toString('utf-8') },
						}),
					callArgs,
					env: { wsId, reqId, preloadState: JSON.stringify(preloadState) },
				})
					.then(result =>
						this.broker.broadcast('ws.send', {
							id: wsId,
							message: { action: 'function.end', result, id: reqId },
						}),
					)
					.catch(error =>
						this.broker.broadcast('ws.send', {
							id: wsId,
							message: { action: 'function.end', result: 'error', id: reqId },
						}),
					);
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
