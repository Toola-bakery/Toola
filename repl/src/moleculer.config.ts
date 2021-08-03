import Moleculer from 'moleculer';

export const redis =
	process.env.NODE_ENV === 'development'
		? {
				host: 'localhost',
				port: 6379,
				db: 1,
		  }
		: {
				sentinels: [{ host: '', port: 26379 }],
				name: '',
				password: '',
				db: 2,
		  };

const redisTransporterAndRegistry = {
	transporter: {
		type: 'Redis',
		options: {
			heartbeatInterval: 1,
			heartbeatTimeout: 3,
			disableHeartbeatChecks: false,
			disableOfflineNodeRemoving: false,
			...redis,
		},
	},
	registry: {
		discoverer: {
			type: 'Redis',
			options: { redis, monitor: false },
		},
	},
};

const localTranporterAndRegistry = {
	registry: {
		discoverer: 'Local',
	},
	transporter: 'TCP',
};

export const moleculerDefaultConfig: Moleculer.BrokerOptions = {
	namespace: 'nodes',
	metrics: true,
	cacher: 'Memory',
	...(process.env.NODE_ENV !== 'development' || process.env.REDIS
		? redisTransporterAndRegistry
		: localTranporterAndRegistry),
};
