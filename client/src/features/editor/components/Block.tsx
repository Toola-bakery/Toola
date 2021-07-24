import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { useDrag } from 'react-dnd';
import { TextBlock } from './Blocks/TextBlock';
import { BasicBlock, Blocks, CodeBlockType, JSONViewBlockType, TableBlockType, TextBlockType } from '../types';
import { CodeBlock } from './Blocks/CodeBlock/CodeBlock';
import { JSONViewBlock } from './Blocks/JSONViewBlock';
import { TableBlock } from './Blocks/TableBlock/TableBlock';
import { useHover } from '../../../hooks/useHover';

export function Block({ block }: { block: BasicBlock & Blocks }): JSX.Element {
	function get() {
		if (block.type === 'text') return <TextBlock block={block as BasicBlock & TextBlockType} />;
		if (block.type === 'code') return <CodeBlock block={block as BasicBlock & CodeBlockType} />;
		if (block.type === 'JSONView') return <JSONViewBlock block={block as BasicBlock & JSONViewBlockType} />;
		if (block.type === 'table') return <TableBlock block={block as BasicBlock & TableBlockType} />;
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
		<div
			ref={dragPreview}
			{...eventHandlers}
			style={{ display: 'flex', flexDirection: 'row', opacity, backgroundColor: 'blue' }}
		>
			<div ref={dragRef} style={{ flexShrink: 1, opacity: hovered ? 1 : 0 }}>
				<DragIndicatorIcon />
			</div>
			<div style={{ flexGrow: 1 }}>{get()}</div>
		</div>
	);
}
