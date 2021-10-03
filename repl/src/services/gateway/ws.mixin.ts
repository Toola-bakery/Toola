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
			async authorization(client, { token, projectId }: { token?: string; projectId?: string }) {
				if (!token) throw new Error('Set token and projectId');

				const { userId, projectId: authProjectId } = await broker.call('auth.validateToken', { authToken: token });
				if (userId) {
					const { hasAccess } = await broker.call('projects.hasAccess', { projectId, userId });
					if (!hasAccess) throw new Error('No access to project');

					return { userId, projectId };
				}
				if (authProjectId) return { projectId: authProjectId };
				throw new Error('Bad token auth');
			},
			onMessage(client, message) {
				try {
					const { action, destinationId } = message;

					if (destinationId) {
						broker.broadcast('ws.send', {
							message: {
								...message,
								redirectedFrom: client.id,
							},
							id: destinationId,
						});
					} else {
						broker.call(action, message, { meta: { wsId: client.id, ...client.meta } });
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
