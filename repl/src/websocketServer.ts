import WebSocket from 'ws';
import { execute } from './executor';
import { TaskQueue } from './taskQueue';

const serverRef: { current?: WebSocket.Server } = {};

function startApi() {
	const taskQueue = new TaskQueue();
	const server = new WebSocket.Server({ port: 8080 });
	serverRef.current = server;

	server.on('connection', ws => {
		ws.on('message', message => {
			if (typeof message !== 'string' && !Buffer.isBuffer(message)) return;

			const req = JSON.parse(Buffer.isBuffer(message) ? message.toString('utf-8') : message);
			taskQueue
				.add(async itemId => {
					ws.send(JSON.stringify({ type: 'execute', id: req.id, itemId }));
					return execute(req.code);
				})
				.then(console.log)
				.catch(console.log);
		});

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		process.stdout.write = (data: string) => {
			// eslint-disable-next-line no-control-regex
			ws.send(data.replace(/\u001B\[[0-9]+m/g, ''));
		};
	});
}

export { serverRef, startApi };
