export const Config = {
	domain: window.location.host.includes('localhost') ? 'http://localhost:8080' : 'https://api.toola.so',
	websocket: window.location.host.includes('localhost') ? 'ws://localhost:8080' : 'wss://api.toola.so',
};
