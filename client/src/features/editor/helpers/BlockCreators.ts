import { v4 } from 'uuid';
import { BlockProps, Blocks } from '../types/blocks';

function copyProps<P extends Blocks['type']>(joinWith: { type: P } & BlockProps, anyBlock?: BlockProps) {
	if (!anyBlock) return joinWith;
	const copy: { type: P } & BlockProps = joinWith;
	(Object.keys(joinWith) as (keyof ({ type: P } & Blocks))[]).forEach((key) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		copy[key] = anyBlock && key in anyBlock ? anyBlock[key] : copy[key];
	});
	return copy;
}

export const BlockCreators: { [key: string]: (anyBlock?: BlockProps) => BlockProps } = {
	page: (anyBlock) =>
		copyProps({ type: 'page', isWide: false, style: 'app', title: 'Untitled', blocks: [], queries: [] }, anyBlock),
	column: (anyBlock) => copyProps({ type: 'column', blocks: [] }, anyBlock),
	row: (anyBlock) => copyProps({ type: 'row', blocks: [] }, anyBlock),
	code: (anyBlock) => {
		const copyAny = { ...anyBlock } as typeof anyBlock;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		delete copyAny.value;
		return copyProps(
			{
				type: 'code',
				language: 'javascript',
				value: `const SDK = require("@toola/sdk");

async function main(){
    console.log('press show logs to see this message');
    
    const resp = await SDK.pageState.getProperty("globals", "pageId") // Этот метод получает значение pageId из клиента по вебсокету
    console.log("this is page id", resp)
}`,
				manualControl: false,
			},
			copyAny,
		);
	},
	query: (anyBlock) => copyProps({ type: 'query', values: {}, manualControl: false }, anyBlock),
	JSONView: (anyBlock) => copyProps({ type: 'JSONView', value: '' }, anyBlock),
	keyValue: (anyBlock) => copyProps({ type: 'keyValue', value: '' }, anyBlock),
	table: (anyBlock) => copyProps({ type: 'table', value: '', manualPagination: false, connectedPage: '' }, anyBlock),
	text: (anyBlock) => copyProps({ type: 'text', value: '', entities: [] }, anyBlock),
	image: (anyBlock) => copyProps({ type: 'image', value: '' }, anyBlock),
	button: (anyBlock) => copyProps({ type: 'button', name: 'run', value: '' }, anyBlock),
	input: (anyBlock) => copyProps({ type: 'input', initialValue: '', label: '' }, anyBlock),
	subpage: (anyBlock) => copyProps({ type: 'subpage', subpageId: v4(), isCreated: false, state: '' }, anyBlock),
};

export const BlockTypes = Object.keys(BlockCreators);
