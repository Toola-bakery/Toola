import { Button, NonIdealState } from '@blueprintjs/core';
import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useParams } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { usePageNavigator } from '../../../../hooks/usePageNavigator';
import { useAppDispatch } from '../../../../redux/hooks';
import { useDrawer } from '../../../drawer/hooks/useDrawer';
import { useBlocks } from './hooks/useBlocks';
import { usePage } from './hooks/usePage';
import { useIsEditing } from '../../hooks/useIsEditing';
import { useStateToWS } from '../../hooks/useStateToWS';
import { setPage } from '../../redux/editor';
import { Block } from '../Block';
import { CreateBlockAtTheEnd } from '../CreateBlockAtTheEnd';
import { BasicBlock } from '../../types/basicBlock';
import { ColumnBlock, ColumnBlockType } from '../Blocks/Layout/ColumnBlock';
import { PageBar } from './PageBar';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import { usePageBlockPropsMutation } from './hooks/usePageBlockPropsMutation';

export type PageBlockType = PageBlockProps;
export type PageBlockProps = {
	type: 'page';
	title: string;
	style: 'app' | 'a4';
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
	page: { id: '', title: 'Untitled', pageId: '', parentId: '', type: 'page', style: 'app', blocks: [] },
	editing: true,
	setEditing: () => {},
	blocksProps: {},
});

function WSHandler() {
	useStateToWS();
	return null;
}

export function Page({ pageId, pageParams }: { pageId: string; pageParams: unknown }): JSX.Element {
	const dispatch = useAppDispatch();
	const { editing, setEditing } = useIsEditing();
	const { navigate } = usePageNavigator();

	const { blocks, deleteBlockMethods, setBlockMethods, blocksMethods, setBlockState, blocksState, blocksProps } =
		useBlocks(pageId, editing);

	const page = blocks?.page as BasicBlock & PageBlockType;

	const { isError, isSuccess, data } = usePage(pageId);

	useEffect(() => {
		if (isSuccess && data) dispatch(setPage({ blocks: data.value, pageId }));
	}, [data, dispatch, isSuccess, pageId]);

	usePageBlockPropsMutation(pageId, blocksProps);

	const hiddenBlocks = useMemo(() => {
		return Object.values(blocks).filter((block) => !block.show);
	}, [blocks]);

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

	return (
		<DndProvider backend={HTML5Backend}>
			<PageContext.Provider value={value}>
				<WSHandler />
				<Helmet title={page?.title} />
				<div style={{ width: '100%', overflowX: 'clip', overflowY: 'hidden', height: '100%' }}>
					{isError ? (
						<NonIdealState
							icon="search"
							title="Page not found"
							action={<Button text="Back home" onClick={() => navigate('')} />}
						/>
					) : null}
					{!isError ? <PageBar /> : null}
					<div style={{ overflowY: 'auto', width: '100%', height: '100%', backgroundColor: 'rgb(229 230 231)' }}>
						<div
							style={
								page?.style === 'a4'
									? { backgroundColor: 'white', width: '21cm', margin: 'auto', marginTop: 20, marginBottom: 20 }
									: { width: '100%', height: '100%', backgroundColor: 'white' }
							}
						>
							{!isError && page ? <ColumnBlock fake block={page as unknown as BasicBlock & ColumnBlockType} /> : null}
							<CreateBlockAtTheEnd parentId="page" />
						</div>
					</div>
				</div>
				<div>
					{hiddenBlocks.map((block) => (
						<Block key={block.id} block={block} />
					))}
				</div>
			</PageContext.Provider>
		</DndProvider>
	);
}
