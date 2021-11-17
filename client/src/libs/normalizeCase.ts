import { noCase } from 'change-case';

function upperCaseFirst(input: string) {
	return input.charAt(0).toUpperCase() + input.substr(1);
}

export function normalizeCase(input: string) {
	return upperCaseFirst(noCase(input));
}
