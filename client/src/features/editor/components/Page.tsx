import React, { useCallback, useEffect, useMemo } from 'react';
import ky from 'ky';
import { useParams } from 'react-router-dom';
import update from 'immutability-helper';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectBlocksProps, selectBlocksStateWithProps, setPage } from '../redux/editor';
import { CreateBlockAtTheEnd } from './CreateBlockAtTheEnd';
import { Block } from './Block';
import { BasicBlock, Blocks, PageBlockType } from '../types';
import { Config } from '../../../config';

export type PageContextType = {
	blocks: { [key: string]: Blocks };
	globals: { pageId: string };
	page: BasicBlock & PageBlockType;
};

export const PageContext = React.createContext<PageContextType>({
	blocks: {},
	globals: { pageId: '' },
	page: { id: '', pageId: '', parentId: '', type: 'page', itemIterator: {}, blocks: [] },
});

export function Page(): JSX.Element {
	const { pageId } = useParams<{ pageId: string }>();

	const dispatch = useAppDispatch();

	const blocks = useAppSelector((state) => selectBlocksStateWithProps(state, pageId));
	const blocksProps = useAppSelector((state) => selectBlocksProps(state, pageId));
	const page = blocks?.[pageId] as BasicBlock & PageBlockType;

	useEffect(() => {
		ky.get(`${Config.domain}/page`, { searchParams: { pageId } })
			.json<{ value: { [key: string]: BasicBlock & Blocks } }>()
			.then((v) => {
				dispatch(setPage({ blocks: v.value, pageId }));
			});
	}, [dispatch, pageId]);

	useEffect(() => {
		ky.post(`${Config.domain}/page`, { json: { pageId, value: blocksProps } });
	}, [blocksProps, pageId]);

	const elements = useMemo(() => {
		if (page?.type !== 'page') return [];
		return page.blocks.map((blockKey) => <Block key={blocks[blockKey].id} block={blocks[blockKey]} />);
	}, [blocks, page]);

	const value = useMemo<PageContextType>(() => ({ blocks, globals: { pageId }, page }), [blocks, pageId, page]);

	return (
		<PageContext.Provider value={value}>
			{elements}
			<CreateBlockAtTheEnd parentId={pageId} />
		</PageContext.Provider>
	);
}
