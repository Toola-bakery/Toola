module.exports = {
	extends: [
		'airbnb-typescript',
		'airbnb/hooks',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	plugins: ['react', '@typescript-eslint'],
	env: {
		browser: true,
		es6: true,
	},
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	rules: {
		'linebreak-style': 'off',
		'max-classes-per-file': 'off',
		'consistent-return': 'off',
		'no-console': 'off',
		'@typescript-eslint/naming-convention': 'off',
		'object-shorthand': ['error', 'always', { avoidQuotes: false }],
		'no-param-reassign': 'off',
		'no-underscore-dangle': ['error', { allow: ['_id'] }],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'import/prefer-default-export': 'off',
		'import/no-cycle': 'off',
		'prettier/prettier': [
			'error',
			{
				printWidth: 120,
				trailingComma: 'all',
				singleQuote: true,
				useTabs: true,
				arrowParens: 'avoid',
			},
		],
	},
};
