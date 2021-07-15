import express from 'express';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';

import('express-async-errors');

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 80);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// eslint-disable-next-line import/no-mutable-exports
let server = null;

function startApi() {
	server = app.listen(app.get('port'), () => {
		console.log('  App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
		console.log('  Press CTRL-C to stop\n');
	});
}
export default app;
export { server, app, startApi };
