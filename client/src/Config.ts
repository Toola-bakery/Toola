export const Config = {
	domain: window.location.host.includes('localhost') ? 'http://localhost:8080' : 'https://toola.so/api',
	websocket: window.location.host.includes('localhost') ? 'ws://localhost:8080' : 'wss://toola.so/api',
};
