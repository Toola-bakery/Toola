import React, { useMemo } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { useReferences } from '../../../executor/hooks/useReferences';
import { useBlockInspectorState } from '../../../inspector/hooks/useBlockInspectorState';

export type KeyValueBlockType = KeyValueBlockProps;
export type KeyValueBlockProps = {
	type: 'keyValue';
	value: string;
};

export function KeyValueBlock({ block }: { block: BasicBlock & KeyValueBlockType }): JSX.Element {
	const { id, value } = block;

	const state = useReferences(value);
	const { immerBlockProps } = useEditor();

	const { onContextMenu, inspectorProps } = useBlockInspectorState([
		{
			label: 'Data Source',
			type: 'input',
			onChange: (v) =>
				immerBlockProps<KeyValueBlockProps>(id, (draft) => {
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
				{Object.entries(state || {}).map(([key, valueOfKey]) => (
					<div key={key} style={{ wordBreak: 'break-word' }}>
						<b>{key}</b>: {`${valueOfKey}`}
					</div>
				))}
			</div>
		</>
	);
}
