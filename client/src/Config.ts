export const Config = {
	domain: window.location.host.includes('localhost')
		? 'http://localhost:8080'
		: 'https://workspace-5wcfu.ondigitalocean.app',
	websocket: window.location.host.includes('localhost')
		? 'ws://localhost:8080'
		: 'wss://workspace-5wcfu.ondigitalocean.app',
};
