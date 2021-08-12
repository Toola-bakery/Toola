import React, { useEffect, useMemo, useState } from 'react';
import ky from 'ky';
import debounce from 'just-debounce';
import { useLocation, useParams } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { useBlocks } from '../hooks/useBlocks';
import { useBlockStateDefault } from '../hooks/useBlockStateDefault';
import { useStateToWS } from '../hooks/useStateToWS';
import { selectBlocksProps, setPage } from '../redux/editor';
import { CreateBlockAtTheEnd } from './CreateBlockAtTheEnd';
import { BasicBlock } from '../types/basicBlock';
import { Config } from '../../../config';
import { ColumnBlock, ColumnBlockType } from './Blocks/Layout/ColumnBlock';
import { Blocks } from '../types/blocks';
import { PageBar } from './PageBar';
import { useWindowSize } from '../../../hooks/useWindowSize';

export type PageBlockType = PageBlockProps & PageBlockState;
export type PageBlockProps = {
	type: 'page';
	title: string;
	blocks: string[];
};
export type PageBlockState = {
	editing: boolean;
};

export type PageContextType = {
	globals: { pageId: string };
	page: BasicBlock & PageBlockType;
	pageId: string;
} & Omit<ReturnType<typeof useBlocks>, 'blocksMethods'>;

export const PageContext = React.createContext<PageContextType>({
	blocks: {},
	deleteBlockMethods: () => {},
	setBlockMethods: () => {},
	globals: { pageId: '' },
	pageId: '',
	page: { id: '', title: 'Untitled', pageId: '', parentId: '', type: 'page', blocks: [], editing: false },
});

const putPage = debounce((pageId, blocksProps) => {
	return ky.post(`${Config.domain}/pages/post`, { json: { id: pageId, value: blocksProps } });
}, 300);

export function Page(): JSX.Element {
	const dispatch = useAppDispatch();
	const { pageId } = useParams<{ pageId: string }>();
	const { state: pageParams } = useLocation();

	useBlockStateDefault<PageBlockState>({ editing: true }, 'page', pageId);
	const [fetching, setFetching] = useState(true);

	const { blocks, blocksMethods, deleteBlockMethods, setBlockMethods } = useBlocks(pageId);
	useStateToWS(pageId, blocksMethods);

	const blocksProps = useAppSelector((state) => selectBlocksProps(state, pageId));
	const page = blocks?.page as BasicBlock & PageBlockType;

	useEffect(() => {
		ky.get(`${Config.domain}/pages/get`, { searchParams: { id: pageId } })
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

	const value = useMemo<PageContextType>(
		() => ({ blocks, pageId, globals: { pageId, pageParams }, page, deleteBlockMethods, setBlockMethods }),
		[blocks, pageId, pageParams, page, deleteBlockMethods, setBlockMethods],
	);
	const { width } = useWindowSize({ width: 1000 });

	return (
		<DndProvider backend={HTML5Backend}>
			<PageContext.Provider value={value}>
				<div style={{ width: width - 240 - 10, overflowX: 'clip' }}>
					{page ? (
						<>
							<PageBar />
							<ColumnBlock fake block={page as unknown as BasicBlock & ColumnBlockType} />
						</>
					) : null}
					<CreateBlockAtTheEnd parentId="page" />
				</div>
			</PageContext.Provider>
		</DndProvider>
	);
}
