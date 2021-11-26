import { Button, NonIdealState } from '@blueprintjs/core';
import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { usePageNavigator } from '../../../../hooks/usePageNavigator';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { DevtoolsWrapper } from '../../../devtools/components/DevtoolsWrapper';
import { LeftDrawerWrapper } from '../../../drawer/components/LeftDrawerWrapper';
import { usePageContext } from '../../../executor/hooks/useReferences';
import { useUser } from '../../../usersAndProjects/hooks/useUser';
import { UserSchema } from '../../../usersAndProjects/redux/user';
import { useCurrent } from '../../hooks/useCurrent';
import { useIsDevtoolsOpen } from '../../hooks/useIsDevtoolsOpen';
import { BlockProps } from '../../types/blocks';
import { CurrentContextProvider } from '../CurrentContext';
import { usePage } from './hooks/usePage';
import { useIsEditing } from '../../hooks/useIsEditing';
import { useStateToWS } from '../../hooks/useStateToWS';
import { selectBlocksProps, setPage } from '../../redux/editor';
import { Block, BlockContext, BlockContextProvider } from '../Block/Block';
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
	isWide: boolean;
	blocks: string[];
	queries: string[];
};

export type PageContextType = {
	globals: { pageId: string; pageParams?: unknown; currentUser: UserSchema | null };
	page: BasicBlock & PageBlockType;
	pageId: string;
	editing: boolean;
	setEditing: (value: boolean) => void;
	isDevtoolsOpen: string | false;
	blocksProps: { [p: string]: BlockProps & BasicBlock };
	isModal: boolean;
};

export const PageContext = React.createContext<PageContextType>({
	globals: { pageId: '', currentUser: null },
	pageId: '',
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
		isWide: false,
	},
	editing: true,
	setEditing: () => {},
	blocksProps: {},
	isDevtoolsOpen: false,
	isModal: false,
});

function WSHandler() {
	useStateToWS();
	return null;
}

function PageBlock({ isError }: { isError: boolean }) {
	const { isModal, editing } = usePageContext();
	const { blocks } = useCurrent();
	const { navigate } = usePageNavigator();

	const page = blocks?.page as BasicBlock & PageBlockType;

	const hiddenBlocks = useMemo(() => {
		return Object.values(blocks).filter((block) => !block.show);
	}, [blocks]);

	return (
		<DndProvider backend={HTML5Backend}>
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
							<BlockContextProvider block={page}>
								{!isError ? <PageBar isModal={isModal} /> : null}
								<PageWrapper page={page}>
									{!isError && page ? (
										<ColumnBlock fake block={page as unknown as BasicBlock & ColumnBlockType} />
									) : null}
									{editing ? <CreateBlockAtTheEnd parentId="page" /> : null}
								</PageWrapper>
							</BlockContextProvider>
						) : null}
					</div>
				</LeftDrawerWrapper>
			</DevtoolsWrapper>
			<div>
				{hiddenBlocks.map((block) => (
					<Block key={block.id} block={block} />
				))}
			</div>
		</DndProvider>
	);
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

	const { user } = useUser(true);
	const blocksProps = useAppSelector((state) => selectBlocksProps(state, pageId));

	const { isError, isSuccess, data } = usePage(pageId);

	useEffect(() => {
		if (isSuccess && data) dispatch(setPage({ blocks: data.value, pageId }));
	}, [data, dispatch, isSuccess, pageId]);
	const { editing, setEditing } = useIsEditing();

	usePageBlockPropsMutation(pageId, blocksProps, editing);

	const { isDevtoolsOpen } = useIsDevtoolsOpen();

	const page = blocksProps?.page as BasicBlock & PageBlockType;

	const value = useMemo<PageContextType>(
		() => ({
			pageId,
			globals: { pageId, pageParams, isModal, currentUser: user || null },
			page,
			editing,
			setEditing,
			blocksProps,
			isDevtoolsOpen,
			isModal,
		}),
		[isDevtoolsOpen, user, editing, setEditing, pageId, pageParams, page, blocksProps, isModal],
	);

	return (
		<PageContext.Provider value={value}>
			<CurrentContextProvider current={undefined}>
				<PageBlock isError={isError} />
			</CurrentContextProvider>
		</PageContext.Provider>
	);
}
