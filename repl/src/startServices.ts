import path from 'path';
import { ServiceBroker } from 'moleculer';
import { moleculerDefaultConfig } from './moleculer.config';

export const broker = new ServiceBroker({ ...moleculerDefaultConfig, logLevel: 'error' });
broker.loadServices(path.resolve(__dirname, './services'), '**/*.service.ts');
broker.loadServices(path.resolve(__dirname, './services'), '**/*.service.js');

export const brokerStartPromise = broker.start();

const stopSignals: NodeJS.Signals[] = ['SIGINT'];
brokerStartPromise
	.then(async () => {
		console.log(
			'brokerStartPromise',
			broker.services.map(s => s.name),
		);
	})
	.then(() => {
		stopSignals.forEach(signal => {
			process.on(signal, async () => {
				await Promise.all([new Promise(ok => setTimeout(ok, 4000)), broker.stop()]);
				process.exit(0);
			});
		});
	})
	.catch(err => console.error(`Error occured! ${err.message}`));
