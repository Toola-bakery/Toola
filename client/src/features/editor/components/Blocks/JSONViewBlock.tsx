import React from 'react';
import JSONTree from 'react-json-tree';
import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { useReferences } from '../../../executor/hooks/useReferences';
import { useBlockInspectorState } from '../../../inspector/hooks/useBlockInspectorState';

export type JSONViewBlockType = JSONViewBlockProps;
export type JSONViewBlockProps = {
	type: 'JSONView';
	value: string;
};

export function JSONViewBlock({ block, hide }: { block: BasicBlock & JSONViewBlockType; hide: boolean }) {
	const { id, value } = block;

	const state = useReferences(value);
	const { immerBlockProps } = useEditor();

	const { onContextMenu, inspectorProps } = useBlockInspectorState([
		{
			label: 'Data Source',
			type: 'input',
			onChange: (v) =>
				immerBlockProps<JSONViewBlockProps>(id, (draft) => {
					draft.value = v;
				}),
			value,
		},
	]);

	if (hide || !block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				<JSONTree data={state} />
			</div>
		</>
	);
}
