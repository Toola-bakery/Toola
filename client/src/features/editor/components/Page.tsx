import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ky from 'ky';
import debounce from 'just-debounce';
import { useParams } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectBlocksProps, selectBlocksStateWithProps, setPage } from '../redux/editor';
import { CreateBlockAtTheEnd } from './CreateBlockAtTheEnd';
import { Block } from './Block';
import { BasicBlock, Blocks, ColumnBlockType, PageBlockType } from '../types';
import { Config } from '../../../config';
import { ColumnBlock } from './Blocks/Layout/ColumnBlock';

export type PageContextType = {
	blocks: { [key: string]: BasicBlock & Blocks };
	globals: { pageId: string };
	page: BasicBlock & PageBlockType;
};

export const PageContext = React.createContext<PageContextType>({
	blocks: {},
	globals: { pageId: '' },
	page: { id: '', pageId: '', parentId: '', type: 'page', itemIterator: {}, blocks: [] },
});

const putPage = debounce((pageId, blocksProps) => {
	return ky.post(`${Config.domain}/page`, { json: { pageId, value: blocksProps } });
}, 300);

export function Page(): JSX.Element {
	const dispatch = useAppDispatch();
	const { pageId } = useParams<{ pageId: string }>();

	const [fetching, setFetching] = useState(true);

	const blocks = useAppSelector((state) => selectBlocksStateWithProps(state, pageId));
	const blocksProps = useAppSelector((state) => selectBlocksProps(state, pageId));
	const page = blocks?.[pageId] as BasicBlock & PageBlockType;

	useEffect(() => {
		ky.get(`${Config.domain}/page`, { searchParams: { pageId } })
			.json<{ value: { [key: string]: BasicBlock & Blocks } }>()
			.then((v) => {
				dispatch(setPage({ blocks: v.value, pageId }));
				setFetching(false);
			});
	}, [dispatch, pageId]);

	useEffect(() => {
		if (fetching) return;
		putPage(pageId, blocksProps);
	}, [fetching, blocksProps, pageId]);

	const value = useMemo<PageContextType>(() => ({ blocks, globals: { pageId }, page }), [blocks, pageId, page]);

	return (
		<DndProvider backend={HTML5Backend}>
			<PageContext.Provider value={value}>
				<div style={{ width: '100%', overflowX: 'clip' }}>
					{page ? <ColumnBlock block={page as unknown as BasicBlock & ColumnBlockType} /> : null}
					<CreateBlockAtTheEnd parentId={pageId} />
				</div>
			</PageContext.Provider>
		</DndProvider>
	);
}
