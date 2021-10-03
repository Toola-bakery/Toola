import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import WebSockets from 'ws';
import { mongoDB } from '../../utils/mongo';
import { Heartbeat } from './Heartbeat';

type ConnectionSchema = {
	_id: string;
	nodeID: string;
	createdAt: Date;
	userId?: ObjectId;
	meta?: { [key: string]: any };
};

const connectionsDb = mongoDB.collection<ConnectionSchema>(
	process.env.NODE_ENV !== 'development' ? 'connections' : 'connections-dev',
);

connectionsDb.createIndex({ nodeID: 1 });
connectionsDb.createIndex({ userId: 1 });

export type WSClient = {
	id: string;
	socket: WebSockets;
	initialized: boolean;
	meta?: { [key: string]: unknown };
	heartbeat?: Heartbeat;
};

export class WSRegister {
	clients: { [id: string]: WSClient } = {};

	readonly onMessage: (client: WSClient, data: any) => void;

	readonly authorization: (client: WSClient, message: unknown) => unknown | Promise<unknown>;

	readonly heartbeatInterval;

	readonly heartbeatTimeout;

	readonly nodeID;

	constructor({
		interval,
		timeout,
		onMessage,
		nodeID,
		authorization,
	}: {
		onMessage: WSRegister['onMessage'];
		interval: number;
		timeout: number;
		nodeID: string;
		authorization?: WSRegister['authorization'];
	}) {
		this.heartbeatTimeout = timeout;
		this.heartbeatInterval = interval;
		this.onMessage = onMessage;
		this.nodeID = nodeID;
		this.authorization = authorization;
	}

	onConnection(socket: WebSockets) {
		const id = uuidv4();
		this.clients[id] = { id, socket, initialized: false };
		this.startHeartbeat(id);
		this.askInit(id);

		socket.on('message', data => {
			this.handleMessage(id, data);
		});

		socket.on('error', () => this.disconnect(id));
		socket.on('close', () => this.disconnect(id));
	}

	async handleMessage(id: string, data: WebSockets.Data) {
		const client = this.clients[id];

		client.heartbeat?.resetTimeout();

		const message = JSON.parse(data.toString());
		const { action, id: respId } = message;

		if (action === 'init' && respId === id) {
			try {
				const meta = (await this.authorization?.(client, message)) || {};
				await this.setInitialized(id, meta);
			} catch (e) {
				this.send(id, { error: e.message || e });
				await this.disconnect(id);
			}
		} else if (client.initialized) {
			this.onMessage(client, message);
		} else {
			this.askInit(id);
		}
	}

	askInit(id) {
		this.send(id, { action: 'init', id });
	}

	get(id: string) {
		return this.clients[id];
	}

	send(id: string, message: any) {
		this.clients[id]?.socket.send(JSON.stringify(message));
	}

	disconnect(id: string) {
		if (!this.clients[id]) return;
		this.clients[id].heartbeat?.stop();
		this.clients[id].socket?.close?.();
		delete this.clients[id];
		return connectionsDb.deleteOne({ _id: id });
	}

	setInitialized(id, meta) {
		this.clients[id].initialized = true;
		this.clients[id].meta = meta;
		return connectionsDb.insertOne({ _id: id, createdAt: new Date(), nodeID: this.nodeID, meta }).then(resp => {
			this.send(id, { action: 'auth.success' });
			return resp;
		});
	}

	startHeartbeat(id) {
		const { clients } = this;
		if (!clients[id]) return;
		clients[id].heartbeat?.stop();
		clients[id].heartbeat = new Heartbeat({
			interval: this.heartbeatInterval,
			timeout: this.heartbeatTimeout,
			onTimeout: () => this.disconnect(id),
			doBeat: () => {
				if (this.clients[id].initialized) this.send(id, { action: 'ping', time: Date.now() });
			},
		});
	}

	static deleteByNode(nodeIds: string[], isWhitelist = false) {
		if (isWhitelist) return connectionsDb.deleteMany({ nodeID: { $not: { $in: nodeIds } } });
		return connectionsDb.deleteMany({ nodeID: { $in: nodeIds } });
	}
}
