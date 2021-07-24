import createFastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyMongo from 'fastify-mongodb';

import { startWS } from './websocketServer';
import { mongoConnect } from '../utils/mongo';
import { databasesRoute } from './databases';
import { pagesRoute } from './pages';

export const fastify = createFastify({
	logger: false,
});

fastify.get('/', async (request, reply) => {
	reply.type('application/json').code(200);
	return { hello: 'world' };
});

databasesRoute(fastify);
pagesRoute(fastify);

fastify.register(fastifyCors, {
	origin: '*',
});

mongoConnect().then(({ client, databaseName }) => {
	fastify.register(fastifyMongo, {
		client,
		forceClose: true,
		database: databaseName,
	});
	fastify.listen(process.env.PORT || 8080, '0.0.0.0', (err, address) => {
		if (err) throw err;
		console.log(`Server is now listening on ${address}`);
	});
});

startWS(fastify.server);
