export function parseIntSafe(value: unknown) {
	if (typeof value === 'number') return Number.isNaN(value) ? '' : value;
	if (typeof value !== 'string') return '';
	const parsed = parseInt(value, 10);
	return Number.isNaN(parsed) ? '' : parsed;
}
