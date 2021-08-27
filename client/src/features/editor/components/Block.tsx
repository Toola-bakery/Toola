import React from 'react';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { useDrag } from 'react-dnd';
import { usePageContext } from '../../executor/hooks/useReferences';
import { ButtonBlock, ButtonBlockType } from './Blocks/ButtonBlock';
import { QueryBlock, QueryBlockType } from './Blocks/QueryBlock/QueryBlock';
import { SubPageBlock, SubPageBlockType } from './Blocks/SubPageBlock';
import { TextBlock, TextBlockType } from './Blocks/TextBlock';
import { BasicBlock } from '../types/basicBlock';
import { Blocks } from '../types/blocks';
import { CodeBlock, CodeBlockType } from './Blocks/CodeBlock/CodeBlock';
import { JSONViewBlock, JSONViewBlockType } from './Blocks/JSONViewBlock';
import { TableBlock, TableBlockType } from './Blocks/TableBlock/TableBlock';
import { useHover } from '../../../hooks/useHover';
import { ImageBlock, ImageBlockType } from './Blocks/ImageBlock';
import { InputBlock, InputBlockType } from './Blocks/InputBlock';

export type BlockContextType = null | (BasicBlock & Blocks);

export const BlockContext = React.createContext<BlockContextType>(null);

function BlockSelector({ block }: { block: BasicBlock & Blocks }) {
	if (block.type === 'text') return <TextBlock block={block as BasicBlock & TextBlockType} />;
	if (block.type === 'code') return <CodeBlock block={block as BasicBlock & CodeBlockType} />;
	if (block.type === 'query') return <QueryBlock block={block as BasicBlock & QueryBlockType} />;
	if (block.type === 'JSONView') return <JSONViewBlock block={block as BasicBlock & JSONViewBlockType} />;
	if (block.type === 'table') return <TableBlock block={block as BasicBlock & TableBlockType} />;
	if (block.type === 'image') return <ImageBlock block={block as BasicBlock & ImageBlockType} />;
	if (block.type === 'input') return <InputBlock block={block as BasicBlock & InputBlockType} />;
	if (block.type === 'button') return <ButtonBlock block={block as BasicBlock & ButtonBlockType} />;
	if (block.type === 'subpage') return <SubPageBlock block={block as BasicBlock & SubPageBlockType} />;
	return <></>;
}

export function Block({ block }: { block: BasicBlock & Blocks }): JSX.Element {
	const {
		page: { editing },
	} = usePageContext();

	const [{ opacity }, dragRef, dragPreview] = useDrag(
		() => ({
			type: 'Block',
			canDrag: editing,
			item: { id: block.id },
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 0.5 : 1,
			}),
		}),
		[block.id, editing],
	);

	const { hovered, eventHandlers } = useHover();

	return (
		<BlockContext.Provider value={block}>
			{!block.show ? (
				<BlockSelector block={block} />
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
					<div ref={dragRef} style={{ width: 25, flexShrink: 1, opacity: hovered && editing ? 1 : 0 }}>
						<DragIndicatorIcon />
					</div>
					<div style={{ width: 'calc(100% - 25px)' }}>
						<BlockSelector block={block} />
					</div>
				</div>
			)}
		</BlockContext.Provider>
	);
}
