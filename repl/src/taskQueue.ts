export class TaskCanceledError extends Error {
	/** The root cause of this cancellation. */
	public reason: any;

	constructor(reason: any) {
		super(reason);
		this.name = 'TaskCanceledError';
		this.reason = reason;
	}
}

export class TaskQueue {
	private prev: Promise<any>;

	private queueId = 0;

	private itemId = 0;

	constructor() {
		this.prev = Promise.resolve();
	}

	add<T>(fn: (itemId: number) => Promise<T>): Promise<T> {
		const { queueId } = this;
		const promise = this.prev.then(
			() => {
				this.itemId += 1;
				if (this.queueId === queueId) return fn(this.itemId);
			},
			reason => {
				if (reason instanceof TaskCanceledError) throw reason;
				throw new TaskCanceledError(reason);
			},
		);
		this.prev = promise;
		return promise;
	}

	reset(delay?: number): void {
		if (delay == null) {
			this.queueId += 1;
			this.itemId = 0;
			this.prev = Promise.resolve();
			return;
		}
		setTimeout(() => {
			this.reset();
		}, delay);
	}
}
