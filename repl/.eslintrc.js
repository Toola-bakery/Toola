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
		'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'import/prefer-default-export': 'off',
		'import/no-cycle': 'off',
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
				printWidth: 120,
			},
		],
	},
};
