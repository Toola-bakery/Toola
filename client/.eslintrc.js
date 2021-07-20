module.exports = {
	extends: [
		'airbnb-typescript',
		'airbnb/hooks',
		'plugin:@typescript-eslint/recommended',
		'plugin:jest/recommended',
		'plugin:prettier/recommended',
	],
	plugins: ['react', '@typescript-eslint', 'jest'],
	env: {
		browser: true,
		es6: true,
		jest: true,
	},
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2018,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	rules: {
		'linebreak-style': 'off',
		'consistent-return': 'off',
		'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
		'react/jsx-uses-react': 'off',
		'react/react-in-jsx-scope': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
		'jsx-a11y/no-noninteractive-element-interactions': 'off',
		'jsx-a11y/click-events-have-key-events': 'off',
		'react/jsx-props-no-spreading': 'off',
		'react/require-default-props': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'import/prefer-default-export': 'off',
		'import/no-cycle': 'off',
		'spaced-comment': 'off',
		'react/prop-types': 'off',
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
				singleQuote: true,
			},
		],
	},
};
