import { Button, NonIdealState } from '@blueprintjs/core';
import React, { useEffect, useMemo, useState } from 'react';
import ky from 'ky';
import debounce from 'just-debounce';
import { useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { usePageNavigator } from '../../../hooks/usePageNavigator';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { usePageContext } from '../../executor/hooks/useReferences';
import { useBlocks } from '../hooks/useBlocks';
import { useBlockStateDefault } from '../hooks/useBlockStateDefault';
import { useStateToWS } from '../hooks/useStateToWS';
import { selectBlocksProps, setPage } from '../redux/editor';
import { Block } from './Block';
import { CreateBlockAtTheEnd } from './CreateBlockAtTheEnd';
import { BasicBlock } from '../types/basicBlock';
import { Config } from '../../../config';
import { ColumnBlock, ColumnBlockType } from './Blocks/Layout/ColumnBlock';
import { Blocks } from '../types/blocks';
import { PageBar } from './PageBar';
import { useWindowSize } from '../../../hooks/useWindowSize';

export type PageBlockType = PageBlockProps;
export type PageBlockProps = {
	type: 'page';
	title: string;
	blocks: string[];
};

export type PageContextType = {
	globals: { pageId: string };
	page: BasicBlock & PageBlockType;
	pageId: string;
	editing: boolean;
	setEditing: (value: boolean) => void;
} & ReturnType<typeof useBlocks>;

export const PageContext = React.createContext<PageContextType>({
	blocks: {},
	deleteBlockMethods: () => {},
	setBlockMethods: () => {},
	blocksMethods: {},
	globals: { pageId: '' },
	pageId: '',
	setBlockState: () => {},
	blocksState: {},
	page: { id: '', title: 'Untitled', pageId: '', parentId: '', type: 'page', blocks: [] },
	editing: true,
	setEditing: () => {},
	blocksProps: {},
});

const putPage = debounce((pageId, blocksProps) => {
	return ky.post(`${Config.domain}/pages/post`, { json: { id: pageId, value: blocksProps } });
}, 300);

function WSHandler() {
	useStateToWS();
	return null;
}

declare global {
	interface Window {
		blocks: { [p: string]: BasicBlock & Blocks };
	}
}
export function Page(): JSX.Element {
	const dispatch = useAppDispatch();
	const { pageId } = useParams<{ pageId: string }>();
	const { state: pageParams } = useLocation();
	const [editing, setEditing] = useLocalStorage('editing', true);

	const { blocks, deleteBlockMethods, setBlockMethods, blocksMethods, setBlockState, blocksState, blocksProps } =
		useBlocks(pageId, editing);

	useEffect(() => {
		window.blocks = blocks;
	}, [blocks]);

	const hiddenBlocks = useMemo(() => {
		const blockValues = Object.values(blocks);
		const response: (BasicBlock & Blocks)[] = [];
		blockValues.forEach((block) => {
			if (!block.show) response.push(block);
		});
		return response;
	}, [blocks]);

	const page = blocks?.page as BasicBlock & PageBlockType;

	const { data, error, isLoading, isError, isSuccess } = useQuery(
		['pages/get', pageId],
		async () => {
			return ky
				.get(`${Config.domain}/pages/get`, { searchParams: { id: pageId } })
				.json<{ value: { [key: string]: BasicBlock & Blocks } }>();
		},
		{
			retry: false,
			refetchOnWindowFocus: false,
		},
	);

	useEffect(() => {
		if (isSuccess && data) dispatch(setPage({ blocks: data.value, pageId }));
	}, [data, dispatch, isSuccess, pageId]);

	useEffect(() => {
		if (isSuccess) putPage(pageId, blocksProps);
	}, [isSuccess, blocksProps, pageId]);

	const { navigate } = usePageNavigator();

	const value = useMemo<PageContextType>(
		() => ({
			blocks,
			pageId,
			globals: { pageId, pageParams },
			page,
			deleteBlockMethods,
			setBlockMethods,
			blocksState,
			setBlockState,
			blocksMethods,
			editing,
			setEditing,
			blocksProps,
		}),
		[
			blocks,
			editing,
			setEditing,
			pageId,
			pageParams,
			page,
			deleteBlockMethods,
			setBlockMethods,
			blocksState,
			setBlockState,
			blocksMethods,
			blocksProps,
		],
	);

	const { width } = useWindowSize({ width: 1000 });

	return (
		<DndProvider backend={HTML5Backend}>
			<PageContext.Provider value={value}>
				<WSHandler />

				<div style={{ width: width - 240, overflowX: 'clip', height: '100%' }}>
					{isError ? (
						<NonIdealState
							icon="search"
							title="Page not found"
							action={<Button text="Back home" onClick={() => navigate('')} />}
						/>
					) : null}
					{page && !error ? (
						<>
							<PageBar />
							<ColumnBlock fake block={page as unknown as BasicBlock & ColumnBlockType} />
						</>
					) : null}
					<CreateBlockAtTheEnd parentId="page" />
				</div>
				<div>
					{hiddenBlocks.map((block) => (
						<Block block={block} />
					))}
				</div>
			</PageContext.Provider>
		</DndProvider>
	);
}
