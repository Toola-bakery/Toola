import { useDrag } from 'react-dnd';
import { usePageContext } from '../../executor/hooks/useReferences';
import { BasicBlock } from '../types/basicBlock';
import { Blocks } from '../types/blocks';

export function useBlockDrag(block: BasicBlock & Blocks) {
	const { editing } = usePageContext();

	const [collectedProps, dragRef, dragPreview] = useDrag(
		() => ({
			type: `Block:${block.type}`,
			canDrag: editing,
			item: { id: block.id },
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 0.5 : 1,
			}),
		}),
		[block.id, editing],
	);

	return [collectedProps, dragRef, dragPreview] as [typeof collectedProps, typeof dragRef, typeof dragPreview];
}
