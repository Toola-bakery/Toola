import React from 'react';
import JSONTree from 'react-json-tree';
import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../Inspector/BlockInspector';
import { useReferences } from '../../hooks/useReferences';
import { useBlockInspectorState } from '../../hooks/useBlockInspectorState';

export type JSONViewBlockType = JSONViewBlockProps;
export type JSONViewBlockProps = {
	type: 'JSONView';
	value: string;
};

export function JSONViewBlock({ block }: { block: BasicBlock & JSONViewBlockType }): JSX.Element {
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

	if (!block.show) return <></>;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				<JSONTree data={state} />
			</div>
		</>
	);
}
