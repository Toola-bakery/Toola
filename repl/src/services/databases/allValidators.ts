import { SyncCheckFunction, AsyncCheckFunction } from 'fastest-validator';

import { DatabaseSchema } from '../../types/database.types';
import { validators as mongoValidators } from './mongo/validator';
import { validators as postgresqlValidators } from './postgresql/validator';

export const allValidators: { [key in DatabaseSchema['type']]: (SyncCheckFunction | AsyncCheckFunction)[] } = {
	mongo: mongoValidators,
	postgresql: postgresqlValidators,
};
