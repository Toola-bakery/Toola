import AWS from 'aws-sdk';
import { Context } from 'moleculer';
import { ObjectId } from 'mongodb';
import { executeFunction } from './executeFunction';

function executeLocal(
	ctx: Context<
		{ code: string; callArgs?: unknown[]; reqId: string; preloadState: { [key: string]: unknown } },
		{ wsId: string; userId: string | ObjectId; projectId: string | ObjectId }
	>,
	token,
) {
	const { code, callArgs = [], reqId, preloadState } = ctx.params;
	const { wsId, userId, projectId } = ctx.meta;

	executeFunction({
		code,
		output: data =>
			ctx.broadcast('ws.send', {
				id: wsId,
				message: { action: 'function.output', id: reqId, data: data.toString('utf-8') },
			}),
		callArgs,
		env: { wsId, token, projectId: projectId.toString(), reqId, preloadState: JSON.stringify(preloadState) },
	})
		.then(result =>
			ctx.broadcast('ws.send', {
				id: wsId,
				message: { action: 'function.end', result, id: reqId },
			}),
		)
		.catch(error =>
			ctx.broadcast('ws.send', {
				id: wsId,
				message: { action: 'function.end', result: 'error', id: reqId },
			}),
		);
}

async function executeViaLambda(
	ctx: Context<
		{ code: string; callArgs?: unknown[]; reqId: string; preloadState: { [key: string]: unknown } },
		{ wsId: string; userId: string | ObjectId; projectId: string | ObjectId }
	>,
	token,
) {
	const { code, callArgs = [], reqId, preloadState } = ctx.params;
	const { wsId, userId, projectId } = ctx.meta;

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
				callArgs,
				preloadState,
			}),
		})
		.promise();

	ctx.broadcast('ws.send', {
		id: wsId,
		message: { action: 'function.end', result: JSON.parse(result.Payload as string), id: reqId },
	});
}

export function crossenvExecuteFunction(
	ctx: Context<
		{ code: string; callArgs?: unknown[]; reqId: string; preloadState: { [key: string]: unknown } },
		{ wsId: string; userId: string | ObjectId; projectId: string | ObjectId }
	>,
	token,
) {
	if (process.env.NODE_ENV !== 'development') {
		return executeViaLambda(ctx, token);
	}

	return executeLocal(ctx, token);
}
