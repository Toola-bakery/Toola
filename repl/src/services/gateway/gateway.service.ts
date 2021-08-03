import ApiGwService from 'moleculer-web';
import { ServiceSchema } from 'moleculer';
import { UserAuthError } from 'types/api.types';
import { WsMixin } from './ws.mixin';

function getTokenFromReq(req) {
	const auth = req.headers.authorization;
	const bearerToken = auth?.startsWith('Bearer') ? auth.slice(7) : null;
	return bearerToken || req.query.authToken || req.headers['auth-token'];
}

function onBeforeCall(ctx, route, req, res) {
	ctx.meta.userAgent = req.headers['user-agent'];
	ctx.meta.ip =
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
}

// const port = Math.round(Math.random() * 3000);
const port = 8080;
console.log(port);

export const GatewayService: ServiceSchema = {
	name: 'gateway',
	mixins: [ApiGwService, WsMixin],
	settings: {
		port,
		ip: '0.0.0.0',
		cors: {
			methods: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
			origin: '*',
		},
		routes: [
			// {
			// 	path: '/auth',
			// 	aliases: {
			// 		diary: 'auth.diary',
			// 		firebase: 'auth.firebase',
			// 		findUsersWithDiaryAccount: 'auth.findUsersWithDiaryAccount',
			// 	},
			// 	onBeforeCall,
			// 	bodyParsers: { json: true },
			// },
			{
				path: '/',
				whitelist: ['*.*'],
				// authorization: true,
				onBeforeCall,
				bodyParsers: {
					json: { strict: false, limit: '8MB' },
					urlencoded: { extended: true },
				},
			},
		],
	},

	actions: {},

	methods: {
		async authorize(ctx, route, req, res) {
			const myToken = getTokenFromReq(req);
			if (myToken) ctx.meta.user = await ctx.call('auth.userByToken', { authToken: myToken });
			else if (route.authorization !== true || req.$endpoint?.action?.rest?.auth === false) ctx.meta.user = null;
			else throw new UserAuthError('Авторизуйтесь');
			return ctx;
		},
	},
};

export default GatewayService;
