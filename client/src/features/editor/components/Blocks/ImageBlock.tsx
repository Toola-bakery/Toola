import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../Inspector/BlockInspector';
import { useReferences } from '../../hooks/useReferences';
import { useBlockInspectorState } from '../../hooks/useBlockInspectorState';

export type ImageBlockType = ImageBlockProps;
export type ImageBlockProps = {
	type: 'image';
	value: string;
};

export function ImageBlock({ block }: { block: BasicBlock & ImageBlockType }): JSX.Element {
	const { id, value } = block;

	const state = useReferences(value);
	const { updateBlockProps } = useEditor();
	const { onContextMenu, inspectorProps } = useBlockInspectorState(id, [
		{
			key: 'Data Source',
			type: 'input',
			onChange: (v) => updateBlockProps({ id, value: v }),
			value,
		},
	]);

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				{state ? <img src={state} style={{ width: '100%' }} /> : <div>Set Source</div>}
			</div>
		</>
	);
}
