import React, { useMemo } from 'react';
import { Block } from '../../Block';
import { BasicBlock, RowBlockType } from '../../../types';
import { usePageContext } from '../../../hooks/useReferences';

export type RowBlockProps = {
	block: BasicBlock & RowBlockType;
};

export function RowBlock({ block }: RowBlockProps) {
	const { blocks } = usePageContext();
	const elements = useMemo(() => {
		return block.blocks.map((blockKey) => <Block key={blocks[blockKey].id} block={blocks[blockKey]} />);
	}, [block, blocks]);

	return <>{elements}</>;
}
