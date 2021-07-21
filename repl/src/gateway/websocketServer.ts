import WebSocket from 'ws';
import http from 'http';
import { execute } from '../notebook/notebook';
import { TaskQueue } from '../utils/taskQueue';
import { executeFunction } from '../serverless/executeFunction';

const serverRef: { current?: WebSocket.Server } = {};

function startWS(httpServer: http.Server) {
	const taskQueue = new TaskQueue();
	const server = new WebSocket.Server({ server: httpServer });
	serverRef.current = server;

	server.on('connection', ws => {
		ws.on('message', message => {
			if (typeof message !== 'string' && !Buffer.isBuffer(message)) return;

			const req = JSON.parse(Buffer.isBuffer(message) ? message.toString('utf-8') : message);
			const send = data => ws.send(JSON.stringify(data));
			taskQueue
				.add(async itemId => {
					if (req.type === 'function') {
						send({ type: 'function.start', id: req.id, itemId });

						executeFunction({
							code: req.code,
							output: data => send({ type: 'function.output', id: req.id, data: data.toString('utf-8') }),
							callArgs: req.callArgs,
						})
							.then(result =>
								send({
									type: 'function.end',
									id: req.id,
									result,
								}),
							)
							.catch(error => send({ type: 'function.end', id: req.id, result: 'error' }));
					} else {
						send({ type: 'execute', id: req.id, itemId });
						return execute(req.code);
					}
				})
				.then(console.log)
				.catch(console.log);
		});
	});
}

export { serverRef, startWS };
