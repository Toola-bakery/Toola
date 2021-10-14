import FastestValidator, { ValidationSchema } from 'fastest-validator';

export const validatorSchema: ValidationSchema[] = [
	{
		$$strict: 'remove',
		_id: { type: 'uuid', version: 4, optional: true },
		type: { type: 'equal', value: 'mongodb' },
		name: { type: 'string', min: 5, max: 50 },
		host: { type: 'string', max: 200 },
		port: { type: 'string', max: 5, optional: true },
		connectionFormat: { type: 'enum', values: ['dns', 'standard'] },
		dbName: { type: 'string', max: 50 },
		username: { type: 'string', max: 50 },
		password: { type: 'string', max: 50 },
		ssl: { type: 'boolean', convert: true },
		CA: { type: 'string', optional: true },
		clientKeyAndCert: { type: 'string', optional: true },
	},
	{
		$$strict: 'remove',
		_id: { type: 'uuid', version: 4, optional: true },
		type: { type: 'equal', value: 'mongodb' },
		name: { type: 'string', min: 5, max: 50 },
		connectionString: { type: 'string', max: 200 },
		ssl: { type: 'boolean', convert: true },
		CA: { type: 'string', optional: true },
		clientKeyAndCert: { type: 'string', optional: true },
	},
];

const v = new FastestValidator();

export const validators = validatorSchema.map(schema => v.compile(schema));
