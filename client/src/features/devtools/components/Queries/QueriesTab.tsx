import React, { useEffect, useState } from 'react';
import { usePrevious } from '../../../../hooks/usePrevious';
import { Block } from '../../../editor/components/Block';
import { usePageContext } from '../../../executor/hooks/useReferences';
import { QueryList } from './QueryList';

export function QueriesTab() {
	const { blocks, page, pageId } = usePageContext();
	const [activeBlockId, setActiveBlockId] = useState<string | undefined>(page?.queries?.[0]);
	const queries = page?.queries || [];
	const defaultQuery = queries[0];

	const previousPageId = usePrevious(pageId);

	useEffect(() => {
		if ((typeof activeBlockId === 'undefined' && defaultQuery) || pageId !== previousPageId)
			setActiveBlockId(defaultQuery);
	}, [activeBlockId, defaultQuery, pageId, previousPageId]);

	const currentActive = activeBlockId || defaultQuery;

	if (!page) return null;

	return (
		<div style={{ display: 'flex', flex: 1, height: '100%' }}>
			<div
				style={{
					height: '100%',
					borderRightWidth: 1,
					borderRightColor: 'rgb(237, 237, 237)',
					borderRightStyle: 'solid',
				}}
			>
				<QueryList activeBlockId={activeBlockId} setActiveBlock={setActiveBlockId} />
			</div>
			<div style={{ height: '100%', width: '100%', overflowY: 'scroll' }}>
				{queries.map((blockId, index) => (
					<Block key={blockId} block={blocks[blockId]} hide={currentActive !== blockId} minimal />
				))}
			</div>
		</div>
	);
}
