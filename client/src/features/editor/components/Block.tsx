import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { useDrag } from 'react-dnd';
import { TextBlock, TextBlockType } from './Blocks/TextBlock';
import { BasicBlock } from '../types/basicBlock';
import { Blocks } from '../types/blocks';
import { CodeBlock, CodeBlockType } from './Blocks/CodeBlock/CodeBlock';
import { JSONViewBlock, JSONViewBlockType } from './Blocks/JSONViewBlock';
import { TableBlock, TableBlockType } from './Blocks/TableBlock/TableBlock';
import { useHover } from '../../../hooks/useHover';
import { ImageBlock, ImageBlockType } from './Blocks/ImageBlock';
import { InputBlock, InputBlockType } from './Blocks/InputBlock';

export function Block({ block }: { block: BasicBlock & Blocks }): JSX.Element {
	function get() {
		if (block.type === 'text') return <TextBlock block={block as BasicBlock & TextBlockType} />;
		if (block.type === 'code') return <CodeBlock block={block as BasicBlock & CodeBlockType} />;
		if (block.type === 'JSONView') return <JSONViewBlock block={block as BasicBlock & JSONViewBlockType} />;
		if (block.type === 'table') return <TableBlock block={block as BasicBlock & TableBlockType} />;
		if (block.type === 'image') return <ImageBlock block={block as BasicBlock & ImageBlockType} />;
		if (block.type === 'input') return <InputBlock block={block as BasicBlock & InputBlockType} />;
		return <></>;
	}

	const [{ opacity }, dragRef, dragPreview] = useDrag(
		() => ({
			type: 'Block',
			item: { id: block.id },
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 0.5 : 1,
			}),
		}),
		[block.id],
	);

	const { hovered, eventHandlers } = useHover();

	return (
		<div ref={dragPreview} {...eventHandlers} style={{ display: 'flex', flexDirection: 'row', opacity }}>
			<div ref={dragRef} style={{ flexShrink: 1, opacity: hovered ? 1 : 0 }}>
				<DragIndicatorIcon />
			</div>
			<div style={{ flexGrow: 1 }}>{get()}</div>
		</div>
	);
}
