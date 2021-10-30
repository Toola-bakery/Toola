import { Button } from '@blueprintjs/core';
import React, { useCallback, useState } from 'react';
import mergeRefs from 'react-merge-refs';
import { usePageContext } from '../../../executor/hooks/useReferences';
import { BlockCreators } from '../../helpers/BlockCreators';
import { useBlockDrag } from '../../hooks/useBlockDrag';
import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { Blocks } from '../../types/blocks';
import { useHover } from '../../../../hooks/useHover';
import { BlockBadge } from './BlockBadge';
import { BlockSelector } from './BlockSelector';

type DragClickEventHandler = React.MouseEventHandler<HTMLElement>;

export type BlockContextType<T extends Blocks = Blocks> = {
	block: undefined | (BasicBlock & T);
	setOnDragClick: (listener: DragClickEventHandler) => void;
};

export const BlockContext = React.createContext<BlockContextType>({ block: undefined, setOnDragClick: () => {} });

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

	const [onDragClick, setOnDragClickPrivate] = useState<DragClickEventHandler>();
	const setOnDragClick = useCallback((handler: DragClickEventHandler) => {
		setOnDragClickPrivate(() => handler);
	}, []);

	const { addBlockAfter } = useEditor();
	const addBlock = useCallback(() => {
		if (editing) addBlockAfter(block.id, BlockCreators.text(), true);
	}, [editing, addBlockAfter, block.id]);

	return (
		<BlockContext.Provider value={{ block, setOnDragClick }}>
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
					<BlockBadge onDragClick={onDragClick} dragRef={dragRef} show={isHover && editing} />
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
		</BlockContext.Provider>
	);
}
