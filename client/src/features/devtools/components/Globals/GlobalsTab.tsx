import { H3 } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import JSONTree from 'react-json-tree';
import { usePageContext } from '../../../executor/hooks/useReferences';

const THEME = {
	scheme: 'google',
	author: 'seth wright (http://sethawright.com)',
	base00: '#1d1f21',
	base01: '#282a2e',
	base02: '#373b41',
	base03: '#969896',
	base04: '#b4b7b4',
	base05: '#c5c8c6',
	base06: '#e0e0e0',
	base07: '#ffffff',
	base08: '#CC342B',
	base09: '#F96A38',
	base0A: '#FBA922',
	base0B: '#198844',
	base0C: '#3971ED',
	base0D: '#3971ED',
	base0E: '#A36AC7',
	base0F: '#3971ED',
};

export function GlobalsTab() {
	const { blocks, globals } = usePageContext();

	const displayBlocks = useMemo(() => {
		const regexp = /^(column|row)\d+$/;
		const allowedKeys = Object.keys(blocks).filter((blockId) => !regexp.test(blockId));
		const newBlocks: typeof blocks = {};
		allowedKeys.sort().forEach((blockId) => {
			newBlocks[blockId] = blocks[blockId];
		});
		return newBlocks;
	}, [blocks]);

	return (
		<div style={{ padding: 8, height: '100%', overflowY: 'scroll' }}>
			<H3>Globals</H3>
			<JSONTree data={globals} hideRoot theme={THEME} invertTheme />
			<H3>Blocks</H3>
			<JSONTree data={displayBlocks} hideRoot theme={THEME} invertTheme />
		</div>
	);
}
