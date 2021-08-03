export class Heartbeat {
	readonly interval: number;

	readonly timeout: number;

	readonly doBeat: () => void;

	readonly onTimeout: () => void;

	readonly intervalInstance: NodeJS.Timeout;

	private timeoutInstance: NodeJS.Timeout;

	constructor({
		doBeat,
		onTimeout,
		interval,
		timeout,
	}: {
		doBeat: () => void;
		onTimeout: () => void;
		interval: number;
		timeout: number;
	}) {
		this.interval = interval;
		this.timeout = timeout;
		this.onTimeout = onTimeout;
		this.doBeat = doBeat;
		this.intervalInstance = setInterval(() => this.doBeat(), this.interval);
		this.resetTimeout();
	}

	resetTimeout() {
		clearTimeout(this.timeoutInstance);
		this.timeoutInstance = setTimeout(() => {
			this.stop();
			this.onTimeout();
		}, this.timeout);
	}

	stop() {
		clearTimeout(this.timeoutInstance);
		clearInterval(this.intervalInstance);
	}
}
