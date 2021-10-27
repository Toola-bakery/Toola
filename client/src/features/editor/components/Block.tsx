import { Button } from '@blueprintjs/core';
import React, { useCallback, useState } from 'react';
import { useDrag } from 'react-dnd';
import { usePageContext } from '../../executor/hooks/useReferences';
import { BlockCreators } from '../helpers/BlockCreators';
import { useBlockDrag } from '../hooks/useBlockDrag';
import { useEditor } from '../hooks/useEditor';
import { ButtonBlock, ButtonBlockType } from './Blocks/ButtonBlock';
import { KeyValueBlock, KeyValueBlockType } from './Blocks/KeyValueBlock';
import { QueryBlock, QueryBlockType } from './Blocks/QueryBlock/QueryBlock';
import { SubPageBlock, SubPageBlockType } from './Blocks/SubPageBlock';
import { TextBlock, TextBlockType } from './Blocks/TextBlock/TextBlock';
import { BasicBlock } from '../types/basicBlock';
import { Blocks } from '../types/blocks';
import { CodeBlock, CodeBlockType } from './Blocks/CodeBlock/CodeBlock';
import { JSONViewBlock, JSONViewBlockType } from './Blocks/JSONViewBlock';
import { TableBlock, TableBlockType } from './Blocks/TableBlock/TableBlock';
import { useHover } from '../../../hooks/useHover';
import { ImageBlock, ImageBlockType } from './Blocks/ImageBlock';
import { InputBlock, InputBlockType } from './Blocks/InputBlock';

type DragClickEventHandler = React.MouseEventHandler<HTMLElement>;

export type BlockContextType<T extends Blocks = Blocks> = {
	block: undefined | (BasicBlock & T);
	setOnDragClick: (listener: DragClickEventHandler) => void;
};

export const BlockContext = React.createContext<BlockContextType>({ block: undefined, setOnDragClick: () => {} });

export function BlockSelector({ block, hide = false }: { block: BasicBlock & Blocks; hide?: boolean }) {
	if (block.type === 'text') return <TextBlock hide={hide} block={block as BasicBlock & TextBlockType} />;
	if (block.type === 'code') return <CodeBlock hide={hide} block={block as BasicBlock & CodeBlockType} />;
	if (block.type === 'query') return <QueryBlock hide={hide} block={block as BasicBlock & QueryBlockType} />;
	if (block.type === 'JSONView') return <JSONViewBlock hide={hide} block={block as BasicBlock & JSONViewBlockType} />;
	if (block.type === 'keyValue') return <KeyValueBlock hide={hide} block={block as BasicBlock & KeyValueBlockType} />;
	if (block.type === 'table') return <TableBlock hide={hide} block={block as BasicBlock & TableBlockType} />;
	if (block.type === 'image') return <ImageBlock hide={hide} block={block as BasicBlock & ImageBlockType} />;
	if (block.type === 'input') return <InputBlock hide={hide} block={block as BasicBlock & InputBlockType} />;
	if (block.type === 'button') return <ButtonBlock hide={hide} block={block as BasicBlock & ButtonBlockType} />;
	if (block.type === 'subpage') return <SubPageBlock hide={hide} block={block as BasicBlock & SubPageBlockType} />;
	return null;
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
	const { hovered, eventHandlers } = useHover();

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
					ref={dragPreview}
					{...eventHandlers}
					style={{
						display: 'flex',
						flexDirection: 'row',
						opacity,
						width: '100%',
						// transform: 'translate3d(0, 0, 0)',
					}}
				>
					<div style={{ width: 25, flexShrink: 1, opacity: hovered && editing ? 1 : 0 }}>
						<Button
							elementRef={dragRef}
							onClick={(e) => onDragClick?.(e)}
							style={{
								padding: 0,
								minHeight: 15,
								minWidth: 10,
								width: 18,
								height: 25,
							}}
							icon="drag-handle-vertical"
							minimal
						/>
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
