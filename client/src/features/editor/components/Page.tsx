import { useMemo } from 'react';

import { EditableBlock } from './EditableBlock';
import { useAppSelector } from '../../../redux/hooks';
import { selectBlocks } from '../redux/editor';
import { CodeBlockType, TextBlockType } from '../types';
import { CodeBlock } from './CodeBlock';
import { CreateBlockAtTheEnd } from './CreateBlockAtTheEnd';

export function Page({ pageId = 'rand' }): JSX.Element {
	const blocks = useAppSelector(selectBlocks);

	const elements = useMemo(() => {
		const page = blocks[pageId];
		if (page.type !== 'page') return [];
		return page.blocks.map(blockKey => {
			if (blocks[blockKey].type === 'text')
				return <EditableBlock key={blocks[blockKey].id} block={blocks[blockKey] as TextBlockType} />;
			if (blocks[blockKey].type === 'code')
				return <CodeBlock key={blocks[blockKey].id} block={blocks[blockKey] as CodeBlockType} />;
			return null;
		});
	}, [blocks, pageId]);
	return (
		<>
			{elements}
			<CreateBlockAtTheEnd parentId={pageId} />
		</>
	);
}
