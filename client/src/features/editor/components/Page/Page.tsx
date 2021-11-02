import { Button, NonIdealState } from '@blueprintjs/core';
import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { usePageNavigator } from '../../../../hooks/usePageNavigator';
import { useAppDispatch } from '../../../../redux/hooks';
import { DevtoolsWrapper } from '../../../devtools/components/DevtoolsWrapper';
import { LeftDrawerWrapper } from '../../../drawer/components/LeftDrawerWrapper';
import { useIsDevtoolsOpen } from '../../hooks/useIsDevtoolsOpen';
import { useBlocks } from './hooks/useBlocks';
import { usePage } from './hooks/usePage';
import { useIsEditing } from '../../hooks/useIsEditing';
import { useStateToWS } from '../../hooks/useStateToWS';
import { setPage } from '../../redux/editor';
import { Block, BlockContext } from '../Block/Block';
import { CreateBlockAtTheEnd } from '../CreateBlockAtTheEnd';
import { BasicBlock } from '../../types/basicBlock';
import { ColumnBlock, ColumnBlockType } from '../Blocks/Layout/ColumnBlock';
import { PageBar } from './PageBar';
import { usePageBlockPropsMutation } from './hooks/usePageBlockPropsMutation';
import { PageWrapper } from './PageWrapper';

export type PageBlockType = PageBlockProps;
export type PageBlockProps = {
	type: 'page';
	title: string;
	emoji?: string;
	style: 'app' | 'a4';
	blocks: string[];
	queries: string[];
};

export type PageContextType = {
	globals: { pageId: string; pageParams?: unknown };
	page: BasicBlock & PageBlockType;
	pageId: string;
	editing: boolean;
	setEditing: (value: boolean) => void;
	isDevtoolsOpen: string | false;
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
	page: {
		id: '',
		title: 'Untitled',
		emoji: undefined,
		pageId: '',
		parentId: '',
		type: 'page',
		style: 'app',
		blocks: [],
		queries: [],
	},
	editing: true,
	setEditing: () => {},
	blocksProps: {},
	isDevtoolsOpen: false,
});

function WSHandler() {
	useStateToWS();
	return null;
}

export function Page({
	pageId,
	pageParams,
	isModal = false,
}: {
	pageId: string;
	pageParams: unknown;
	isModal?: boolean;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const { editing, setEditing } = useIsEditing();
	const { isDevtoolsOpen, setDevtoolsOpen } = useIsDevtoolsOpen();
	const { navigate } = usePageNavigator();

	const { blocks, deleteBlockMethods, setBlockMethods, blocksMethods, setBlockState, blocksState, blocksProps } =
		useBlocks(pageId, { editing, isDevtoolsOpen });

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
			isDevtoolsOpen,
		}),
		[
			blocks,
			isDevtoolsOpen,
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
				<DevtoolsWrapper>
					<LeftDrawerWrapper hide={isModal}>
						<div
							style={{
								width: '100%',
								height: '100%',
								overflowX: 'clip',
								overflowY: 'hidden',
								display: 'flex',
								flex: 1,
								flexDirection: 'column',
							}}
						>
							{isError ? (
								<NonIdealState
									icon="search"
									title="Page not found"
									action={<Button text="Back home" onClick={() => navigate('')} />}
								/>
							) : null}
							{page ? (
								<BlockContext.Provider value={{ block: page, setOnDragClick: () => {} }}>
									{!isError ? <PageBar isModal={isModal} /> : null}
									<PageWrapper page={page}>
										{!isError && page ? (
											<ColumnBlock fake block={page as unknown as BasicBlock & ColumnBlockType} />
										) : null}
										{editing ? <CreateBlockAtTheEnd parentId="page" /> : null}
									</PageWrapper>
								</BlockContext.Provider>
							) : null}
						</div>
					</LeftDrawerWrapper>
				</DevtoolsWrapper>
				<div>
					{hiddenBlocks.map((block) => (
						<Block key={block.id} block={block} />
					))}
				</div>
			</PageContext.Provider>
		</DndProvider>
	);
}
