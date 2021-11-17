import { Button } from '@blueprintjs/core';
import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import mergeRefs from 'react-merge-refs';
import { v4 } from 'uuid';
import { usePageContext } from '../../../executor/hooks/useReferences';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { BlockCreators } from '../../helpers/BlockCreators';
import { useBlockInspectorProvider } from '../../hooks/blockInspector/useBlockInspectorProvider';
import { useBlockDrag } from '../../hooks/useBlockDrag';
import { useCurrent } from '../../hooks/useCurrent';
import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { Blocks } from '../../types/blocks';
import { useHover } from '../../../../hooks/useHover';
import { BlockBadge } from './BlockBadge';
import { BlockSelector } from './BlockSelector';

type DragClickEventHandler = React.MouseEventHandler<HTMLElement>;

export type BlockContextType = {
	block: undefined | BasicBlock;
	setOnDragClick: (listener: DragClickEventHandler) => void;
	onDragClick?: DragClickEventHandler;
	menu: MenuItemProps[];
	appendMenuParticle: (menu: MenuItemProps[], index: number) => () => void;
};

export const BlockContext = React.createContext<BlockContextType>({
	appendMenuParticle: () => () => {},
	menu: [],
	block: undefined,
	setOnDragClick: () => {},
	onDragClick: () => {},
});

export function BlockContextProvider({
	blockId,
	block: customBlock,
	children,
}: PropsWithChildren<{ blockId?: string; block?: BasicBlock & Blocks }>) {
	const { blocks } = useCurrent();

	const [onDragClick, setOnDragClickPrivate] = useState<DragClickEventHandler>();
	const setOnDragClick = useCallback((handler: DragClickEventHandler) => {
		setOnDragClickPrivate(() => handler);
	}, []);

	const block = blockId ? blocks[blockId] : customBlock;

	if ((!blockId && !customBlock) || !block) throw new Error('BlockContextProvider: set customBlock or blockId');

	const { appendMenuParticle, menu } = useBlockInspectorProvider(block);

	const value = useMemo(
		() => ({ block, setOnDragClick, onDragClick, menu, appendMenuParticle }),
		[block, setOnDragClick, onDragClick, menu, appendMenuParticle],
	);
	return <BlockContext.Provider value={value}>{children}</BlockContext.Provider>;
}

export function Block({
	block,
	hide = false,
	minimal = false,
}: {
	block: BasicBlock & Blocks;
	hide?: boolean;
	minimal?: boolean;
}): JSX.Element {
	const { editing } = usePageContext();

	const [{ opacity }, dragRef, dragPreview] = useBlockDrag(block);
	const { ref, isHover } = useHover<HTMLElement>();

	const { addBlockAfter } = useEditor();
	const addBlock = useCallback(() => {
		if (editing) addBlockAfter(block.id, { type: 'text' }, true);
	}, [editing, addBlockAfter, block.id]);

	return (
		<BlockContextProvider block={block}>
			{!block.show || hide || minimal ? (
				<BlockSelector block={block} hide={hide} />
			) : (
				<div
					ref={mergeRefs([dragPreview, ref])}
					style={{
						display: 'flex',
						flexDirection: 'row',
						opacity,
						width: '100%',
						position: 'relative',
						transform: 'translate3d(0, 0, 0)',
					}}
				>
					<BlockBadge dragRef={dragRef} show={isHover && editing} />
					<div style={{ width: 25, flexShrink: 1, opacity: isHover && editing ? 1 : 0 }}>
						<Button
							onClick={addBlock}
							style={{
								padding: 0,
								minHeight: 15,
								minWidth: 10,
								width: 18,
								height: 25,
								opacity: 0.6,
							}}
							icon="plus"
							minimal
						/>
					</div>
					<div style={{ width: 'calc(100% - 25px)' }}>
						<BlockSelector block={block} />
					</div>
				</div>
			)}
		</BlockContextProvider>
	);
}
