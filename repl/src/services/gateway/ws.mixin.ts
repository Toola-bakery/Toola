import { Context, ServiceSchema } from 'moleculer';
import WebSockets from 'ws';
import { broker } from '../../startServices';
import { WSRegister } from './WSRegister';

export const WsMixin: ServiceSchema = {
	name: 'ws-gateway',
	events: {
		'$node.disconnected'(ctx) {
			const { node } = ctx.params;
			console.log('$node.disconnected', ctx.eventType, node.id);
			WSRegister.deleteByNode([node.id]);
		},
		'ws.send'(ctx) {
			const { id, message } = ctx.params || {};
			if (typeof id !== 'string') return;
			(this.wsRegister as WSRegister).send(id, message);
		},
		'ws.broadcast'(ctx) {
			const { action, ...rest } = ctx.params || {};
			if (typeof action !== 'string') return;
			this.broadcast({ action, ...rest });
		},
		'**'(ctx) {
			const { sendWS = false, action = ctx.eventName, ...rest } = ctx.params || {};
			if (typeof action !== 'string' || !sendWS) return;
			if (ctx.eventType !== 'broadcast') ctx.call(`${this.name}.broadcast`, { action, ...rest });
			else this.broadcast({ action, ...rest });
		},
	},
	settings: {
		sockets: {
			heartbeatTimeout: 30 * 1000,
			heartbeatInterval: 5000,
		},
		whitelist: ['*'],
	},
	actions: {
		broadcast: {
			params: {
				action: { type: 'string' },
			},
			handler(ctx) {
				const { room, action, ...rest } = ctx.params;
				return ctx.broadcast('ws.broadcast', { room, action, ...rest });
			},
		},
		send: {
			params: {
				wsId: 'string',
				message: { type: 'object' },
			},
			handler(ctx: Context<{ wsId: string; message: unknown }>) {
				const { wsId, message } = ctx.params;
				this.broker.broadcast('ws.send', {
					id: wsId,
					message,
				});
			},
		},
	},
	async started() {
		this.cleanOfflineNodeConnections();

		const wsRegister = new WSRegister({
			interval: 5000,
			timeout: 30 * 1000 * 100,
			nodeID: broker.nodeID,
			onMessage(id, message) {
				try {
					const { action, destinationId } = message;

					if (destinationId) {
						broker.broadcast('ws.send', {
							message: {
								...message,
								redirectedFrom: id,
							},
							id: destinationId,
						});
					} else {
						broker.call(action, message, { meta: { wsId: id } });
					}
				} catch (e) {
					console.log(e);
				}
			},
		});

		this.wsRegister = wsRegister;

		const wss = new WebSockets.Server({ server: this.server });
		this.wss = wss;
		wss.on('connection', wsRegister.onConnection.bind(wsRegister));
	},
	methods: {
		async cleanOfflineNodeConnections() {
			const services = (await this.broker.call('$node.services')) as { name: string; nodes: string[] }[];
			const nodeIds = services.filter(n => n.name === this.name)?.[0]?.nodes;
			if (nodeIds) return WSRegister.deleteByNode(nodeIds, true);
		},
		async broadcast(message: any) {
			const keys = Object.keys(this.wsRegister.clients);
			keys.forEach(id => this.send(id, message));
		},
	},
};

export default WsMixin;
