import React from 'react';
import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { useReferences } from '../../../executor/hooks/useReferences';
import { useBlockInspectorState } from '../../../inspector/hooks/useBlockInspectorState';

export type ImageBlockType = ImageBlockProps;
export type ImageBlockProps = {
	type: 'image';
	value: string;
};

export function ImageBlock({ block }: { block: BasicBlock & ImageBlockType }): JSX.Element {
	const { id, value } = block;

	const state = useReferences(value);
	const { updateBlockProps } = useEditor();
	const { onContextMenu, inspectorProps } = useBlockInspectorState([
		{
			label: 'Data Source',
			type: 'input',
			onChange: (v) => updateBlockProps({ id, value: v }),
			value,
		},
	]);

	if (!block.show) return <></>;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				{state ? <img src={state} style={{ width: '100%' }} /> : <div>Set Source</div>}
			</div>
		</>
	);
}
