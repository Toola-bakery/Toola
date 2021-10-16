import React, { useEffect, useState } from 'react';
import { useDrawer } from '../../../drawer/hooks/useDrawer';
import { Block, BlockSelector } from '../../../editor/components/Block';
import { usePageContext } from '../../../executor/hooks/useReferences';
import { QueryList } from './QueryList';

export function QueriesTab() {
	const { blocks, page } = usePageContext();
	const [activeBlockId, setActiveBlockId] = useState<string | undefined>();

	const queries = page?.queries || [];
	const defaultQuery = queries[0];

	useEffect(() => {
		if (typeof activeBlockId === 'undefined' && defaultQuery) setActiveBlockId(defaultQuery);
	}, [activeBlockId, defaultQuery]);

	if (!page) return null;

	return (
		<div style={{ display: 'flex', flex: 1, height: '100%' }}>
			<div style={{ height: '100%' }}>
				<QueryList activeBlockId={activeBlockId} setActiveBlock={setActiveBlockId} />
			</div>
			<div style={{ height: '100%', width: 900, overflowY: 'scroll' }}>
				{queries.map((blockId) => (
					<Block block={blocks[blockId]} hide={activeBlockId !== blockId} minimize />
				))}
			</div>
		</div>
	);
}
