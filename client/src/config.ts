export const Config = {
	domain: window.location.host.includes('localhost')
		? 'http://localhost:8080'
		: 'https://workspace-mtxds.ondigitalocean.app',
	websocket: window.location.host.includes('localhost')
		? 'ws://localhost:8080'
		: 'wss://workspace-mtxds.ondigitalocean.app',
};
