import React, { useMemo } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { selectBlocksStateWithProps } from '../redux/editor';
import { CreateBlockAtTheEnd } from './CreateBlockAtTheEnd';
import { Block } from './Block';
import { Blocks } from '../types';

export type PageContextType = {
	blocks: { [key: string]: Blocks };
	globals: { pageId: string };
};

export const PageContext = React.createContext<PageContextType>({
	blocks: {},
	globals: { pageId: '' },
});

export function Page({ pageId = 'rand' }): JSX.Element {
	const blocks = useAppSelector(selectBlocksStateWithProps);

	const elements = useMemo(() => {
		const page = blocks[pageId];
		if (page.type !== 'page') return [];

		return page.blocks.map((blockKey) => <Block key={blocks[blockKey].id} block={blocks[blockKey]} />);
	}, [blocks, pageId]);

	const value = useMemo<PageContextType>(() => ({ blocks, globals: { pageId } }), [blocks, pageId]);

	return (
		<PageContext.Provider value={value}>
			{elements}
			<CreateBlockAtTheEnd parentId={pageId} />
		</PageContext.Provider>
	);
}
