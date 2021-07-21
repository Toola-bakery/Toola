import React, { useEffect, useMemo } from 'react';
import ky from 'ky';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectBlocksProps, selectBlocksStateWithProps, setPage } from '../redux/editor';
import { CreateBlockAtTheEnd } from './CreateBlockAtTheEnd';
import { Block } from './Block';
import { Blocks } from '../types';
import { Config } from '../../../config';

export type PageContextType = {
	blocks: { [key: string]: Blocks };
	globals: { pageId: string };
};

export const PageContext = React.createContext<PageContextType>({
	blocks: {},
	globals: { pageId: '' },
});

export function Page(): JSX.Element {
	const { pageId } = useParams<{ pageId: string }>();
	const dispatch = useAppDispatch();

	const blocks = useAppSelector((state) => selectBlocksStateWithProps(state, pageId));
	const blocksProps = useAppSelector((state) => selectBlocksProps(state, pageId));
	useEffect(() => {
		ky.get(`${Config.domain}/page`, { searchParams: { pageId } })
			.json<{ value: { [key: string]: Blocks } }>()
			.then((v) => {
				dispatch(setPage({ blocks: v.value, pageId }));
			});
	}, [dispatch, pageId]);

	useEffect(() => {
		ky.post(`${Config.domain}/page`, { json: { pageId, value: blocksProps } });
	}, [blocksProps, pageId]);

	const elements = useMemo(() => {
		const page = blocks?.[pageId];
		if (page?.type !== 'page') return [];

		return page.blocks.map((blockKey) => <Block key={blocks[blockKey].id} block={blocks[blockKey]} />);
	}, [blocks, pageId]);

	const value = useMemo<PageContextType>(() => ({ blocks, globals: { pageId } }), [blocks, pageId]);

	return (
		<PageContext.Provider value={value}>
			{elements}
			<CreateBlockAtTheEnd pageId={pageId} parentId={pageId} />
		</PageContext.Provider>
	);
}
