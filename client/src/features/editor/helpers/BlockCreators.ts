import { BlockProps, Blocks } from '../types/blocks';

function copyProps<P extends Blocks['type']>(joinWith: { type: P } & BlockProps, anyBlock?: Blocks) {
	if (!anyBlock) return joinWith;
	const copy: { type: P } & BlockProps = joinWith;
	(Object.keys(joinWith) as (keyof ({ type: P } & Blocks))[]).forEach((key) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		copy[key] = anyBlock && key in anyBlock ? anyBlock[key] : copy[key];
	});
	return copy;
}

export const BlockCreators: { [P in Blocks['type']]: (anyBlock?: Blocks) => { type: P } & BlockProps } = {
	page: (anyBlock?: Blocks) => copyProps({ type: 'page', blocks: [] }, anyBlock),
	column: (anyBlock?: Blocks) => copyProps({ type: 'column', blocks: [] }, anyBlock),
	row: (anyBlock?: Blocks) => copyProps({ type: 'row', blocks: [] }, anyBlock),
	code: (anyBlock?: Blocks) =>
		copyProps({ type: 'code', language: 'javascript', value: '', manualControl: false }, anyBlock),
	JSONView: (anyBlock?: Blocks) => copyProps({ type: 'JSONView', value: '' }, anyBlock),
	table: (anyBlock?: Blocks) => copyProps({ type: 'table', value: '' }, anyBlock),
	text: (anyBlock?: Blocks) => copyProps({ type: 'text', value: '' }, anyBlock),
	image: (anyBlock?: Blocks) => copyProps({ type: 'image', value: '' }, anyBlock),
	input: (anyBlock?: Blocks) => copyProps({ type: 'input', initialValue: '', label: '' }, anyBlock),
};
